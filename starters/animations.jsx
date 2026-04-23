/**
 * animations.jsx — Timeline-based animation engine
 *
 * Usage (with Babel):
 *   <script type="text/babel" src="animations.jsx"></script>
 *   <script type="text/babel">
 *     function MyAnimation() {
 *       return (
 *         <Stage duration={5000} width={1920} height={1080}>
 *           <Sprite start={0} end={2000}>
 *             {(progress) => (
 *               <div style={{ opacity: progress, fontSize: '48px' }}>
 *                 Hello World
 *               </div>
 *             )}
 *           </Sprite>
 *           <Sprite start={1000} end={4000}>
 *             {(progress) => (
 *               <div style={{ transform: `translateX(${interpolate(progress, 0, 1, -100, 100)}px)` }}>
 *                 Moving text
 *               </div>
 *             )}
 *           </Sprite>
 *         </Stage>
 *       );
 *     }
 *   </script>
 *
 * Components:
 *   Stage — auto-scale + scrubber + play/pause container
 *   Sprite — time-bounded element with progress callback
 *
 * Hooks:
 *   useTime() — current time in ms
 *   useSprite() — { progress, visible } within a Sprite
 *
 * Utilities:
 *   Easing — collection of easing functions
 *   interpolate(t, inMin, inMax, outMin, outMax) — map progress to value range
 */

// Easing functions
const Easing = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInExpo: t => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: t => {
    if (t === 0 || t === 1) return t
    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
  },
  easeOutBack: t => {
    const c = 1.70158
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
  },
  easeOutElastic: t => {
    if (t === 0 || t === 1) return t
    return Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3) + 1
  },
  spring: t => 1 - Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 6)
}

function interpolate(t, inMin, inMax, outMin, outMax, easing = Easing.linear) {
  const normalized = Math.max(0, Math.min(1, (t - inMin) / (inMax - inMin)))
  const eased = easing(normalized)
  return outMin + eased * (outMax - outMin)
}

// Time context
const TimeContext = React.createContext(0)

function useTime() {
  return React.useContext(TimeContext)
}

// Sprite context
const SpriteContext = React.createContext({ progress: 0, visible: false })

function useSprite() {
  return React.useContext(SpriteContext)
}

// Stage component
function Stage({
  duration = 5000,
  width = 1920,
  height = 1080,
  autoPlay = true,
  loop = true,
  background = "#000",
  children
}) {
  const [time, setTime] = React.useState(0)
  const [playing, setPlaying] = React.useState(autoPlay)
  const [dragging, setDragging] = React.useState(false)
  const animRef = React.useRef(null)
  const startRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const scrubberRef = React.useRef(null)

  // Animation loop
  React.useEffect(() => {
    if (!playing) return

    startRef.current = performance.now() - time

    const tick = now => {
      let elapsed = now - startRef.current
      if (elapsed >= duration) {
        if (loop) {
          startRef.current = now
          elapsed = 0
        } else {
          elapsed = duration
          setPlaying(false)
        }
      }
      setTime(elapsed)
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [playing, duration, loop])

  // Auto-scale
  const [scale, setScale] = React.useState(1)
  React.useEffect(() => {
    const resize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight - 48 // scrubber height
      setScale(Math.min(vw / width, vh / height))
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [width, height])

  // Scrubber interaction
  const handleScrub = e => {
    if (!scrubberRef.current) return
    const rect = scrubberRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setTime(x * duration)
    startRef.current = performance.now() - x * duration
  }

  const progress = time / duration

  const stageStyles = {
    wrapper: {
      width: "100vw",
      height: "100vh",
      background: "#111",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontFamily: "system-ui, sans-serif"
    },
    canvas: {
      width,
      height,
      background,
      transform: `scale(${scale})`,
      transformOrigin: "center center",
      position: "relative",
      overflow: "hidden"
    },
    controls: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "48px",
      background: "rgba(0,0,0,0.9)",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: "12px",
      zIndex: 9999
    },
    playBtn: {
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#fff",
      fontSize: "18px",
      background: "none",
      border: "none",
      borderRadius: "4px"
    },
    scrubber: {
      flex: 1,
      height: "4px",
      background: "rgba(255,255,255,0.2)",
      borderRadius: "2px",
      cursor: "pointer",
      position: "relative"
    },
    scrubberFill: {
      height: "100%",
      background: "#fff",
      borderRadius: "2px",
      width: `${progress * 100}%`,
      transition: dragging ? "none" : "width 0.05s linear"
    },
    scrubberThumb: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: "#fff",
      position: "absolute",
      top: "50%",
      left: `${progress * 100}%`,
      transform: "translate(-50%, -50%)"
    },
    timeLabel: {
      color: "rgba(255,255,255,0.6)",
      fontSize: "12px",
      fontVariantNumeric: "tabular-nums",
      minWidth: "80px",
      textAlign: "right"
    }
  }

  const formatTime = ms => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const ss = s % 60
    const ms_ = Math.floor((ms % 1000) / 10)
    return `${m}:${String(ss).padStart(2, "0")}.${String(ms_).padStart(2, "0")}`
  }

  return (
    <TimeContext.Provider value={time}>
      <div style={stageStyles.wrapper}>
        <div style={stageStyles.canvas} ref={containerRef}>
          {children}
        </div>
        <div style={stageStyles.controls}>
          <button style={stageStyles.playBtn} onClick={() => setPlaying(!playing)}>
            {playing ? "⏸" : "▶"}
          </button>
          <div
            ref={scrubberRef}
            style={stageStyles.scrubber}
            onMouseDown={e => {
              setDragging(true)
              setPlaying(false)
              handleScrub(e)
            }}
            onMouseMove={e => dragging && handleScrub(e)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}>
            <div style={stageStyles.scrubberFill} />
            <div style={stageStyles.scrubberThumb} />
          </div>
          <span style={stageStyles.timeLabel}>
            {formatTime(time)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </TimeContext.Provider>
  )
}

// Sprite component
function Sprite({ start = 0, end = 1000, easing = Easing.linear, children }) {
  const time = useTime()

  const visible = time >= start && time <= end
  const rawProgress = visible ? Math.max(0, Math.min(1, (time - start) / (end - start))) : 0
  const progress = easing(rawProgress)

  const ctx = { progress, visible, rawProgress, time: time - start }

  if (!visible) return null

  return (
    <SpriteContext.Provider value={ctx}>
      {typeof children === "function" ? children(progress, ctx) : children}
    </SpriteContext.Provider>
  )
}

// Entry/exit primitives
function FadeIn({ start, duration = 500, children }) {
  return (
    <Sprite start={start} end={start + duration}>
      {p => <div style={{ opacity: p }}>{children}</div>}
    </Sprite>
  )
}

function FadeOut({ start, duration = 500, children }) {
  return (
    <Sprite start={start} end={start + duration}>
      {p => <div style={{ opacity: 1 - p }}>{children}</div>}
    </Sprite>
  )
}

function SlideIn({ start, duration = 500, from = "left", distance = 100, children }) {
  const axis = from === "left" || from === "right" ? "X" : "Y"
  const dir = from === "left" || from === "top" ? -1 : 1

  return (
    <Sprite start={start} end={start + duration} easing={Easing.easeOutCubic}>
      {p => (
        <div
          style={{
            opacity: p,
            transform: `translate${axis}(${(1 - p) * distance * dir}px)`
          }}>
          {children}
        </div>
      )}
    </Sprite>
  )
}

Object.assign(window, {
  Stage,
  Sprite,
  Easing,
  interpolate,
  useTime,
  useSprite,
  FadeIn,
  FadeOut,
  SlideIn,
  TimeContext,
  SpriteContext
})
