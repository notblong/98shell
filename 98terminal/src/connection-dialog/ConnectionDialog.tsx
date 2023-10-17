import { FormEvent } from "react";
import ConnectionIcon from "../assets/connection-icon.png";
import axios from "../axios";

function ConnectionDialog({ onRequestConnect, onClose }) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ipAddress = e.target["ipAddress"].value;
    const user = e.target["user"].value;
    const password = e.target["password"].value;

    axios
      .post("/connect", {
        ipAddress: ipAddress,
        user: user,
        password: password,
      })
      .then((res) => {
        console.log(res);
        onRequestConnect(true);
      });
  };

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
      }}
    >
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Connect</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={() => onClose(false)} />
          </div>
        </div>

        <div className="window-body">
          <form onSubmit={(e) => onSubmit(e)}>
            <img src={ConnectionIcon} alt="Connection icon" />
            <div className="field-row-stacked" style={{ width: "200px" }}>
              <label>IP Address</label>
              <input
                required
                id="ipAddress"
                type="text"
                name="ipAddress"
                pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
              />
            </div>
            <div className="field-row-stacked" style={{ width: "200px" }}>
              <label htmlFor="text19">Login as</label>
              <input id="user" type="text" name="user" />
            </div>
            <div className="field-row-stacked" style={{ width: "200px" }}>
              <label htmlFor="text19">Password</label>
              <input id="password" type="password" name="password" />
            </div>
            <div className="field-row" style={{ justifyContent: "center" }}>
              <input type="submit" value="Connect" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConnectionDialog;
