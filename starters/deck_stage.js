/**
 * deck_stage.js — Slide deck web component
 *
 * Usage:
 *   <script src="deck_stage.js"></script>
 *   <deck-stage>
 *     <section>Slide 1</section>
 *     <section>Slide 2</section>
 *   </deck-stage>
 *
 * Features:
 * - Auto-scales fixed canvas (1920×1080) to fit any viewport with letterboxing
 * - Keyboard navigation (←→, Space, Home/End)
 * - Click/tap navigation (left third = prev, right two-thirds = next)
 * - Slide counter overlay
 * - localStorage persistence of current slide
 * - Print-to-PDF support (one page per slide)
 * - Posts {slideIndexChanged: N} to parent for speaker notes sync
 * - Auto-tags slides with data-screen-label and data-om-validate
 * - Responds to 'noscale' attribute to disable scaling (for PPTX export)
 */

class DeckStage extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this._currentSlide = 0
    this._slides = []
  }

  connectedCallback() {
    const width = parseInt(this.getAttribute("width") || "1920")
    const height = parseInt(this.getAttribute("height") || "1080")
    const storageKey = this.getAttribute("storage-key") || "deck-stage-slide"

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          background: #000;
          overflow: hidden;
          position: relative;
        }

        :host([noscale]) .canvas {
          transform: none !important;
          width: ${width}px !important;
          height: ${height}px !important;
        }

        .canvas {
          width: ${width}px;
          height: ${height}px;
          position: relative;
          overflow: hidden;
          transform-origin: center center;
        }

        ::slotted(section) {
          position: absolute;
          inset: 0;
          display: none;
          width: ${width}px;
          height: ${height}px;
          box-sizing: border-box;
        }

        ::slotted(section.active) {
          display: flex;
          flex-direction: column;
        }

        .counter {
          position: fixed;
          bottom: 12px;
          right: 16px;
          font: 500 14px/1 system-ui, sans-serif;
          color: rgba(255,255,255,0.5);
          z-index: 9999;
          pointer-events: none;
          user-select: none;
        }

        .nav-hint {
          position: fixed;
          bottom: 12px;
          left: 16px;
          font: 400 12px/1 system-ui, sans-serif;
          color: rgba(255,255,255,0.3);
          z-index: 9999;
          pointer-events: none;
          user-select: none;
        }

        @media print {
          :host {
            display: block;
            background: white;
            width: auto;
            height: auto;
          }
          .canvas {
            transform: none !important;
            width: ${width}px;
            height: ${height}px;
          }
          ::slotted(section) {
            display: flex !important;
            position: relative !important;
            page-break-after: always;
            break-after: page;
          }
          .counter, .nav-hint { display: none; }
        }
      </style>
      <div class="canvas">
        <slot></slot>
      </div>
      <div class="counter"></div>
      <div class="nav-hint">← → or click to navigate</div>
    `

    this._canvas = this.shadowRoot.querySelector(".canvas")
    this._counter = this.shadowRoot.querySelector(".counter")
    this._width = width
    this._height = height
    this._storageKey = storageKey

    // Collect slides
    this._collectSlides()

    // Restore position
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      const idx = parseInt(saved)
      if (idx >= 0 && idx < this._slides.length) {
        this._currentSlide = idx
      }
    }

    this._showSlide(this._currentSlide)
    this._resize()

    // Event listeners
    window.addEventListener("resize", () => this._resize())
    window.addEventListener("keydown", e => this._onKey(e))
    this.addEventListener("click", e => this._onClick(e))

    // MutationObserver for dynamic slides
    this._observer = new MutationObserver(() => {
      this._collectSlides()
      this._showSlide(this._currentSlide)
    })
    this._observer.observe(this, { childList: true })
  }

  _collectSlides() {
    this._slides = Array.from(this.querySelectorAll(":scope > section"))
    this._slides.forEach((s, i) => {
      const label = String(i + 1).padStart(2, "0")
      s.setAttribute("data-screen-label", `${label} ${s.getAttribute("data-screen-label") || "Slide " + (i + 1)}`)
      s.setAttribute("data-om-validate", "true")
    })
  }

  _showSlide(idx) {
    idx = Math.max(0, Math.min(idx, this._slides.length - 1))
    this._currentSlide = idx
    this._slides.forEach((s, i) => {
      s.classList.toggle("active", i === idx)
    })
    this._counter.textContent = `${idx + 1} / ${this._slides.length}`

    // Persist
    localStorage.setItem(this._storageKey, String(idx))

    // Notify parent (for speaker notes)
    window.postMessage({ slideIndexChanged: idx }, "*")
    if (window.parent !== window) {
      window.parent.postMessage({ slideIndexChanged: idx }, "*")
    }
  }

  _resize() {
    if (this.hasAttribute("noscale")) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const scale = Math.min(vw / this._width, vh / this._height)
    this._canvas.style.transform = `scale(${scale})`
  }

  _onKey(e) {
    switch (e.key) {
      case "ArrowRight":
      case " ":
      case "PageDown":
        e.preventDefault()
        this.next()
        break
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault()
        this.prev()
        break
      case "Home":
        e.preventDefault()
        this.goTo(0)
        break
      case "End":
        e.preventDefault()
        this.goTo(this._slides.length - 1)
        break
    }
  }

  _onClick(e) {
    const rect = this.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width / 3) {
      this.prev()
    } else {
      this.next()
    }
  }

  // Public API
  next() {
    this._showSlide(this._currentSlide + 1)
  }
  prev() {
    this._showSlide(this._currentSlide - 1)
  }
  goTo(idx) {
    this._showSlide(idx)
  }
  get currentSlide() {
    return this._currentSlide
  }
  get slideCount() {
    return this._slides.length
  }
}

customElements.define("deck-stage", DeckStage)

// Global helpers for JS-driven navigation (used by gen_pptx)
window.goToSlide = function (idx) {
  const deck = document.querySelector("deck-stage")
  if (deck) deck.goTo(idx)
}
