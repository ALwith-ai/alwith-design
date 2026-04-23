/**
 * ios_frame.jsx — iPhone device bezel with status bar
 *
 * Usage (with Babel):
 *   <script type="text/babel" src="ios_frame.jsx"></script>
 *   <script type="text/babel">
 *     root.render(
 *       <IOSFrame model="iphone15pro" statusBar>
 *         <div>Your app content here</div>
 *       </IOSFrame>
 *     );
 *   </script>
 *
 * Props:
 *   model: "iphone15pro" | "iphone15" | "iphoneSE" (default: iphone15pro)
 *   statusBar: boolean — show iOS status bar (default: true)
 *   keyboard: boolean — show iOS keyboard (default: false)
 *   time: string — status bar time (default: "9:41")
 *   scale: number — scale factor (default: 1)
 */

const iosFrameModels = {
  iphone15pro: { width: 393, height: 852, radius: 55, notch: "dynamic-island", safeTop: 59, safeBottom: 34 },
  iphone15: { width: 393, height: 852, radius: 50, notch: "dynamic-island", safeTop: 59, safeBottom: 34 },
  iphoneSE: { width: 375, height: 667, radius: 0, notch: "none", safeTop: 20, safeBottom: 0 }
}

const iosFrameStyles = {
  wrapper: scale => ({
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    transform: `scale(${scale})`,
    transformOrigin: "top center"
  }),
  device: m => ({
    width: m.width + 24,
    height: m.height + 24,
    borderRadius: m.radius + 12,
    background: "#1a1a1a",
    padding: "12px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset",
    position: "relative",
    overflow: "hidden"
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
    height: "54px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px 0",
    background: "inherit",
    position: "relative",
    zIndex: 10,
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "-apple-system, SF Pro Text, sans-serif"
  },
  dynamicIsland: {
    width: "126px",
    height: "37px",
    background: "#000",
    borderRadius: "19px",
    position: "absolute",
    top: "11px",
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
  homeIndicator: {
    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "134px",
    height: "5px",
    borderRadius: "3px",
    background: "#000",
    opacity: 0.2,
    zIndex: 10
  },
  batteryIcon: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  }
}

function IOSStatusBar({ time = "9:41", dark = false }) {
  const color = dark ? "#fff" : "#000"
  return (
    <div style={{ ...iosFrameStyles.statusBar, color }}>
      <span>{time}</span>
      <div style={iosFrameStyles.batteryIcon}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0.5" y="0.5" width="13" height="10" rx="2" stroke={color} strokeOpacity="0.35" />
          <rect x="1.5" y="1.5" width="11" height="8" rx="1" fill={color} />
          <path d="M15 4V7.5C15.8 7.5 15.8 4 15 4Z" fill={color} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

function IOSFrame({
  model = "iphone15pro",
  statusBar = true,
  keyboard = false,
  time = "9:41",
  scale = 1,
  dark = false,
  children
}) {
  const m = iosFrameModels[model] || iosFrameModels.iphone15pro

  return (
    <div style={iosFrameStyles.wrapper(scale)}>
      <div style={iosFrameStyles.device(m)}>
        <div style={iosFrameStyles.screen(m)}>
          {m.notch === "dynamic-island" && <div style={iosFrameStyles.dynamicIsland} />}
          {statusBar && <IOSStatusBar time={time} dark={dark} />}
          <div style={iosFrameStyles.content(m, statusBar)}>{children}</div>
          {m.safeBottom > 0 && <div style={iosFrameStyles.homeIndicator} />}
        </div>
      </div>
    </div>
  )
}

Object.assign(window, { IOSFrame, IOSStatusBar })
