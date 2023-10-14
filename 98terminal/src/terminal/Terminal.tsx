import { useEffect, useState } from "react";
import { Terminal as XTerminal } from "xterm";
import { socket } from "../socket";

export interface TerminalConfigs {
  font?: {
    size?: number;
    type?: string;
  };
}

function Terminal({ onSubmit }) {
  let command = "";
  let placeHolderLength = 0;
  const [rendered, setRendered] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const xterm = new XTerminal();

  useEffect(() => {
    console.log(onSubmit);
    // if (onSubmit == false) return;
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onExecuteCmd = (response: string) => {
      placeHolderLength = getPlaceHolderLength(response);
      xterm.write("\r\n" + response);
      prompt();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("exec-ser2client", onExecuteCmd);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [onSubmit]);

  useEffect(() => {
    const terminalDiv = document.getElementById("terminal");
    if (terminalDiv && !rendered) {
      xterm.open(terminalDiv);
      setRendered(true);
      // xterm.write('\x1B[1;3;31mxterm.js\x1B[0m [~] $ ');
    }
  }, []);

  // useEffect(() => {
  //   console.log("terminal configs updated", configuration);
  //   if (configuration.font?.size) {
  //     console.log("current font size: " + xterm.options.fontSize);
  //     xterm.options.fontSize = configuration.font.size;
  //   }
  // }, [configuration]);

  xterm.onData((e) => {
    switch (e) {
      case "\u0003": // Ctrl+C
        xterm.write("^C");
        prompt();
        break;
      case "\r": // Enter
        runCommand(command);
        break;
      case "\u007F": // Backspace (DEL)
        // Do not delete the prompt
        if (xterm.buffer.active.cursorX > placeHolderLength) {
          xterm.write("\b \b");
          if (command.length > 0) {
            command = command.substring(0, command.length - 1);
          }
        }
        break;
      default: // Print all other characters for demo
        if (
          (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) ||
          e >= "\u00a0"
        ) {
          command = command.concat(e);
          xterm.write(e);
        }
    }
  });

  const getPlaceHolderLength = (placeHolder: string): number => {
    placeHolder = placeHolder.replaceAll("[?2004h", "");
    return placeHolder.length;
  };

  const prompt = (escLine = true) => {
    command = "";

    if (!escLine) {
      // xterm.write('\x1B[1;3;31mxterm.js\x1B[0m [~] $ ');
      return;
    }

    // xterm.write('\r\n\x1B[1;3;31mxterm.js\x1B[0m [~] $ ');
  };

  const execute = (command: string) => {
    socket.emit("exec-client2ser", command, () => {
      console.log("Executed command");
    });
  };

  const runCommand = (command: string) => {
    switch (command) {
      case "clear": {
        xterm.reset();
        prompt(false);
        break;
      }
      default: {
        execute(command);
        // prompt();
        break;
      }
    }
  };
  return <div id="terminal"></div>;
}

export default Terminal;
