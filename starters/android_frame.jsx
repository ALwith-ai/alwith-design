/**
 * android_frame.jsx — Android device bezel with status bar
 *
 * Usage (with Babel):
 *   <script type="text/babel" src="android_frame.jsx"></script>
 *   <script type="text/babel">
 *     root.render(
 *       <AndroidFrame>
 *         <div>Your app content here</div>
 *       </AndroidFrame>
 *     );
 *   </script>
 *
 * Props:
 *   model: "pixel8" | "pixel7" (default: pixel8)
 *   statusBar: boolean (default: true)
 *   navBar: boolean — show bottom nav bar (default: true)
 *   time: string (default: "12:00")
 *   scale: number (default: 1)
 */

const androidFrameModels = {
  pixel8: { width: 412, height: 915, radius: 40, punchHole: true, safeTop: 48, safeBottom: 24 },
  pixel7: { width: 412, height: 915, radius: 36, punchHole: true, safeTop: 48, safeBottom: 24 }
}

const androidFrameStyles = {
  wrapper: scale => ({
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    transform: `scale(${scale})`,
    transformOrigin: "top center"
  }),
  device: m => ({
    width: m.width + 20,
    height: m.height + 20,
    borderRadius: m.radius + 10,
    background: "#1a1a1a",
    padding: "10px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    position: "relative"
  }),
  screen: m => ({
    width: m.width,
    height: m.height,
    borderRadius: m.radius,
    background: "#fff",
    overflow: "hidden",
    position: "relative"
  }),
  statusBar: {
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px 0",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "Roboto, system-ui, sans-serif",
    position: "relative",
    zIndex: 10
  },
  punchHole: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#000",
    position: "absolute",
    top: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20
  },
  content: (m, hasStatusBar) => ({
    position: "absolute",
    top: hasStatusBar ? m.safeTop : 0,
    left: 0,
    right: 0,
    bottom: m.safeBottom,
    overflow: "auto"
  }),
  navBar: {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  navPill: {
    width: "100px",
    height: "4px",
    borderRadius: "2px",
    background: "#000",
    opacity: 0.2
  }
}

function AndroidStatusBar({ time = "12:00", dark = false }) {
  const color = dark ? "#fff" : "#000"
  return (
    <div style={{ ...androidFrameStyles.statusBar, color }}>
      <span>{time}</span>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill={color}>
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
        <svg width="14" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0.5" y="0.5" width="13" height="10" rx="2" stroke={color} strokeOpacity="0.35" />
          <rect x="1.5" y="1.5" width="11" height="8" rx="1" fill={color} />
          <path d="M15 4V7.5C15.8 7.5 15.8 4 15 4Z" fill={color} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

function AndroidFrame({
  model = "pixel8",
  statusBar = true,
  navBar = true,
  time = "12:00",
  scale = 1,
  dark = false,
  children
}) {
  const m = androidFrameModels[model] || androidFrameModels.pixel8

  return (
    <div style={androidFrameStyles.wrapper(scale)}>
      <div style={androidFrameStyles.device(m)}>
        <div style={androidFrameStyles.screen(m)}>
          {m.punchHole && <div style={androidFrameStyles.punchHole} />}
          {statusBar && <AndroidStatusBar time={time} dark={dark} />}
          <div style={androidFrameStyles.content(m, statusBar)}>{children}</div>
          {navBar && (
            <div style={androidFrameStyles.navBar}>
              <div style={androidFrameStyles.navPill} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Object.assign(window, { AndroidFrame, AndroidStatusBar })
