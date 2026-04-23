/**
 * macos_window.jsx — macOS window chrome with traffic lights
 *
 * Usage (with Babel):
 *   <script type="text/babel" src="macos_window.jsx"></script>
 *   <script type="text/babel">
 *     root.render(
 *       <MacOSWindow title="My App" width={800} height={600}>
 *         <div>Your app content here</div>
 *       </MacOSWindow>
 *     );
 *   </script>
 *
 * Props:
 *   title: string — window title
 *   width: number (default: 800)
 *   height: number (default: 600)
 *   variant: "light" | "dark" (default: "light")
 *   toolbar: boolean — show toolbar area (default: false)
 *   scale: number (default: 1)
 */

const macosWindowStyles = {
  wrapper: scale => ({
    display: "inline-flex",
    transform: `scale(${scale})`,
    transformOrigin: "top center"
  }),
  window: (w, h, dark) => ({
    width: w,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: dark
      ? "0 22px 70px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.15)"
      : "0 22px 70px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.08)",
    background: dark ? "#282828" : "#fff"
  }),
  titleBar: dark => ({
    height: "38px",
    background: dark
      ? "linear-gradient(180deg, #3a3a3a 0%, #2d2d2d 100%)"
      : "linear-gradient(180deg, #e8e8e8 0%, #d6d6d6 100%)",
    borderBottom: dark ? "1px solid #1f1f1f" : "1px solid #c0c0c0",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    position: "relative",
    userSelect: "none"
  }),
  trafficLights: {
    display: "flex",
    gap: "8px",
    alignItems: "center"
  },
  trafficLight: color => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: color,
    boxShadow: `inset 0 0 0 0.5px rgba(0,0,0,0.15)`
  }),
  title: dark => ({
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "13px",
    fontWeight: 500,
    color: dark ? "#ccc" : "#4d4d4d",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "60%"
  }),
  toolbar: dark => ({
    height: "38px",
    background: dark ? "#2d2d2d" : "#f0f0f0",
    borderBottom: dark ? "1px solid #1f1f1f" : "1px solid #d6d6d6",
    display: "flex",
    alignItems: "center",
    padding: "0 12px"
  }),
  content: h => ({
    height: h,
    overflow: "auto"
  })
}

function MacOSWindow({ title, width = 800, height = 600, variant = "light", toolbar = false, scale = 1, children }) {
  const dark = variant === "dark"

  return (
    <div style={macosWindowStyles.wrapper(scale)}>
      <div style={macosWindowStyles.window(width, undefined, dark)}>
        <div style={macosWindowStyles.titleBar(dark)}>
          <div style={macosWindowStyles.trafficLights}>
            <div style={macosWindowStyles.trafficLight("#ff5f57")} />
            <div style={macosWindowStyles.trafficLight("#febc2e")} />
            <div style={macosWindowStyles.trafficLight("#28c840")} />
          </div>
          {title && <span style={macosWindowStyles.title(dark)}>{title}</span>}
        </div>
        {toolbar && <div style={macosWindowStyles.toolbar(dark)} />}
        <div style={macosWindowStyles.content(height)}>{children}</div>
      </div>
    </div>
  )
}

Object.assign(window, { MacOSWindow })
