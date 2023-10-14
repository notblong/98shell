import { useState } from "react";
import "./App.css";
import ConnectionDialog from "./connection-dialog/ConnectionDialog";
import Terminal, { TerminalConfigs } from "./terminal/Terminal";

function App() {
  const [fontSize, setFontSize] = useState(5);
  const [requestConnect, setRequestConnect] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const configuration = {} as TerminalConfigs;
  const onRequestConnect = (requested: boolean) => {
    setRequestConnect(requested);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {openDialog === true && requestConnect === false && (
          <ConnectionDialog
            onRequestConnect={onRequestConnect}
            onClose={(e: boolean) => setOpenDialog(e)}
          />
        )}
        <div
          style={{ width: "100%", minWidth: "545px", maxWidth: "880px" }}
          className="window"
        >
          <div className="title-bar">
            <div className="title-bar-text">Terminal</div>
            <div className="title-bar-controls"></div>
          </div>

          <div className="window-body">
            <div className="field-row" style={{ width: "300px" }}>
              <button onClick={() => setOpenDialog(!openDialog)}>
                Connect
              </button>
            </div>
            <div className="field-row" style={{ width: "300px" }}>
              <label>Font size:</label>
              <label>Aa</label>
              <input
                style={{ width: "120px" }}
                id="terminal-font"
                type="range"
                min="1"
                max="11"
                value={fontSize}
                onChange={(e) => {
                  console.log(e.target.value);
                  setFontSize(parseInt(e.target.value));
                  configuration.font = { size: fontSize };
                  console.log(configuration);
                }}
              />
              <label style={{ fontSize: 15 }}>Aa</label>
            </div>
            <hr />
            <Terminal onSubmit={requestConnect} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
