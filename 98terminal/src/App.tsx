import { useState } from 'react'
import './App.css'
import Terminal, { TerminalConfigs } from './terminal/Terminal'

function App() {
  const [fontSize, setFontSize] = useState(5);
  const configuration = {} as TerminalConfigs;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ width: '100%', minWidth: '545px', maxWidth: '880px'}} className="window">
          <div className="title-bar">
            <div className="title-bar-text">Terminal</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize" />
              <button aria-label="Maximize" />
              <button aria-label="Close" />
            </div>
          </div>

          <div className="window-body">
            <div className="field-row" style={{width: "300px"}}>
              <button>Toggle</button>
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
                onChange={(e) => { console.log(e.target.value); setFontSize(parseInt(e.target.value)); configuration.font = { size: fontSize };  console.log(configuration)}} />
              <label style={{fontSize: 15}}>Aa</label>
            </div>
            <hr />
            <Terminal configuration={configuration} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
