/**
 * browser_window.jsx — Browser window chrome with tab bar
 *
 * Usage (with Babel):
 *   <script type="text/babel" src="browser_window.jsx"></script>
 *   <script type="text/babel">
 *     root.render(
 *       <BrowserWindow url="https://example.com" tabs={["My App"]} width={1200} height={800}>
 *         <div>Your page content here</div>
 *       </BrowserWindow>
 *     );
 *   </script>
 *
 * Props:
 *   url: string — URL shown in address bar
 *   tabs: string[] — tab titles (default: ["New Tab"])
 *   activeTab: number — active tab index (default: 0)
 *   width: number (default: 1200)
 *   height: number (default: 800)
 *   variant: "light" | "dark" (default: "light")
 *   scale: number (default: 1)
 */

const browserWindowStyles = {
  wrapper: scale => ({
    display: "inline-flex",
    transform: `scale(${scale})`,
    transformOrigin: "top center"
  }),
  window: (w, dark) => ({
    width: w,
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: dark
      ? "0 22px 70px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.1)"
      : "0 22px 70px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.08)",
    background: dark ? "#282828" : "#fff"
  }),
  tabBar: dark => ({
    height: "38px",
    background: dark ? "#202124" : "#dee1e6",
    display: "flex",
    alignItems: "flex-end",
    padding: "0 8px 0 72px",
    position: "relative"
  }),
  trafficLights: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    gap: "8px"
  },
  dot: color => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: color
  }),
  tab: (active, dark) => ({
    height: "30px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: active ? 500 : 400,
    fontFamily: "system-ui, sans-serif",
    color: dark ? (active ? "#e8eaed" : "#9aa0a6") : active ? "#202124" : "#5f6368",
    background: active ? (dark ? "#35363a" : "#fff") : "transparent",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginRight: "1px"
  }),
  addressBar: dark => ({
    height: "36px",
    background: dark ? "#35363a" : "#fff",
    borderBottom: dark ? "1px solid #3c4043" : "1px solid #dadce0",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: "8px"
  }),
  navButtons: {
    display: "flex",
    gap: "4px"
  },
  navBtn: dark => ({
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: dark ? "#9aa0a6" : "#5f6368",
    fontSize: "16px",
    cursor: "pointer"
  }),
  urlBar: dark => ({
    flex: 1,
    height: "28px",
    background: dark ? "#202124" : "#f1f3f4",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    fontSize: "13px",
    color: dark ? "#bdc1c6" : "#5f6368",
    fontFamily: "system-ui, sans-serif"
  }),
  content: h => ({
    height: h,
    overflow: "auto"
  })
}

function BrowserWindow({
  url = "",
  tabs = ["New Tab"],
  activeTab = 0,
  width = 1200,
  height = 800,
  variant = "light",
  scale = 1,
  children
}) {
  const dark = variant === "dark"

  return (
    <div style={browserWindowStyles.wrapper(scale)}>
      <div style={browserWindowStyles.window(width, dark)}>
        {/* Tab bar */}
        <div style={browserWindowStyles.tabBar(dark)}>
          <div style={browserWindowStyles.trafficLights}>
            <div style={browserWindowStyles.dot("#ff5f57")} />
            <div style={browserWindowStyles.dot("#febc2e")} />
            <div style={browserWindowStyles.dot("#28c840")} />
          </div>
          {tabs.map((tab, i) => (
            <div key={i} style={browserWindowStyles.tab(i === activeTab, dark)}>
              {tab}
            </div>
          ))}
        </div>

        {/* Address bar */}
        <div style={browserWindowStyles.addressBar(dark)}>
          <div style={browserWindowStyles.navButtons}>
            <span style={browserWindowStyles.navBtn(dark)}>{"←"}</span>
            <span style={browserWindowStyles.navBtn(dark)}>{"→"}</span>
          </div>
          <div style={browserWindowStyles.urlBar(dark)}>
            {url && (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  style={{ marginRight: "6px", opacity: 0.5 }}>
                  <path d="M8 1a5 5 0 0 0-5 5v1H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V6a5 5 0 0 0-5-5zm-3 6V6a3 3 0 1 1 6 0v1H5z" />
                </svg>
                {url}
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={browserWindowStyles.content(height)}>{children}</div>
      </div>
    </div>
  )
}

Object.assign(window, { BrowserWindow })
