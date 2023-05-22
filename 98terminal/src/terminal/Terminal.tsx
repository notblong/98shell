import { useEffect, useState } from 'react';
import { Terminal as XTerminal } from 'xterm';

export interface TerminalConfigs {
  font?: {
    size?: number;
    type?: string;
  }
}

function Terminal(configuration) {
  let command = '';
  const [rendered, setRendered] = useState(false);
  const xterm = new XTerminal();

  useEffect(() => {
    const terminalDiv = document.getElementById('terminal');
    if (terminalDiv && !rendered) {
      xterm.open(terminalDiv);
      setRendered(true);
      xterm.write('\x1B[1;3;31mxterm.js\x1B[0m [~] $ ');
    }

  }, []);

  useEffect(() => {
    console.log('terminal configs updated', configuration);
    if (configuration.font?.size) {
      console.log('current font size: ' + xterm.options.fontSize);
      xterm.options.fontSize = configuration.font.size;
    }
  }, [configuration]);


  xterm.onData(e => {
    switch (e) {
      case '\u0003': // Ctrl+C
        xterm.write('^C');
        prompt();
        break;
      case '\r': // Enter
        console.log('run command: ', command);
        
        runCommand(command);
        break;
      case '\u007F': // Backspace (DEL)
        // Do not delete the prompt
        if (xterm.buffer.active.cursorX > 15) {
          xterm.write('\b \b');
          if (command.length > 0) {
            command = command.substring(0, command.length - 1);
          }
        }
        break;
      default: // Print all other characters for demo
        if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
          command = command.concat(e);
          xterm.write(e);
        }
    }
  });

  const prompt = (escLine = true) => {
    command = '';

    if (!escLine) {
      xterm.write('\x1B[1;3;31mxterm.js\x1B[0m [~] $ ');
      return;
    }

    xterm.write('\r\n\x1B[1;3;31mxterm.js\x1B[0m [~] $ ');
  }

  const runCommand = (command: string) => {
    console.log(command);
    
    switch (command) {
      case 'clear': {
        xterm.reset();
        prompt(false);
        break;
      }
      default: {
        prompt();
        break;
      }
    }
  }
  return (
    <>
      <div id="terminal"></div>
    </>
  )
}

export default Terminal;