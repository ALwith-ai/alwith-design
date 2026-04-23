/**
 * design_canvas.jsx — Grid layout for presenting multiple design options
 *
 * Usage (with Babel):
 *   <script type="text/babel" src="design_canvas.jsx"></script>
 *   <script type="text/babel">
 *     const root = ReactDOM.createRoot(document.getElementById('root'));
 *     root.render(
 *       <DesignCanvas columns={3} title="Color Exploration">
 *         <DesignOption label="Option A" subtitle="Warm tones">
 *           <div>Your design here</div>
 *         </DesignOption>
 *         <DesignOption label="Option B" subtitle="Cool tones">
 *           <div>Your design here</div>
 *         </DesignOption>
 *       </DesignCanvas>
 *     );
 *   </script>
 */

const designCanvasStyles = {
  canvas: {
    width: "100vw",
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "40px",
    boxSizing: "border-box",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  title: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px"
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "32px"
  },
  grid: columns => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: "24px",
    alignItems: "start"
  }),
  option: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.2s ease"
  },
  optionHover: {
    boxShadow: "0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)"
  },
  optionContent: {
    padding: "0",
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  optionLabel: {
    padding: "16px 20px",
    borderTop: "1px solid #eee"
  },
  optionLabelText: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#1a1a1a",
    margin: 0
  },
  optionSubtitle: {
    fontSize: "12px",
    color: "#888",
    marginTop: "4px"
  }
}

function DesignCanvas({ columns = 3, title, subtitle, children }) {
  return (
    <div style={designCanvasStyles.canvas}>
      {title && <h1 style={designCanvasStyles.title}>{title}</h1>}
      {subtitle && <p style={designCanvasStyles.subtitle}>{subtitle}</p>}
      <div style={designCanvasStyles.grid(columns)}>{children}</div>
    </div>
  )
}

function DesignOption({ label, subtitle, children }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      style={{
        ...designCanvasStyles.option,
        ...(hovered ? designCanvasStyles.optionHover : {})
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={designCanvasStyles.optionContent}>{children}</div>
      {label && (
        <div style={designCanvasStyles.optionLabel}>
          <p style={designCanvasStyles.optionLabelText}>{label}</p>
          {subtitle && <p style={designCanvasStyles.optionSubtitle}>{subtitle}</p>}
        </div>
      )}
    </div>
  )
}

// Export to global scope for cross-file usage
Object.assign(window, { DesignCanvas, DesignOption })
