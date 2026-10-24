const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\lenovo\\.gemini\\antigravity-ide\\brain\\ee7fb6a9-eb5b-4432-af7b-94e72cb6b6fc\\scratch\\chrome_debug_portfolio';
const port = 9225;

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=' + port,
  '--user-data-dir=' + userDataDir,
  '--window-size=1280,800',
  '--disable-gpu',
  '--no-first-run',
  'http://localhost:5173/'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:' + port + '/json', res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const targets = JSON.parse(raw);
      const pageTarget = targets.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (!pageTarget) {
        chrome.kill();
        return;
      }

      const wsUrl = new URL(pageTarget.webSocketDebuggerUrl);
      const req = http.request({
        host: wsUrl.hostname,
        port: wsUrl.port,
        path: wsUrl.pathname,
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket',
          'Sec-WebSocket-Key': crypto.randomBytes(16).toString('base64'),
          'Sec-WebSocket-Version': '13'
        }
      });

      req.on('upgrade', (res, socket) => {
        function send(cmd) {
          const payload = Buffer.from(JSON.stringify(cmd));
          const mask = crypto.randomBytes(4);
          let header;
          if (payload.length < 126) {
            header = Buffer.from([0x81, 0x80 | payload.length]);
          } else {
            header = Buffer.alloc(4);
            header[0] = 0x81;
            header[1] = 0x80 | 126;
            header.writeUInt16BE(payload.length, 2);
          }
          const masked = Buffer.alloc(payload.length);
          for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
          socket.write(Buffer.concat([header, mask, masked]));
        }

        // Enable Console and Runtime
        send({ id: 1, method: 'Console.enable' });
        send({ id: 2, method: 'Runtime.enable' });

        let errors = [];
        let wsBuf = Buffer.alloc(0);
        socket.on('data', chunk => {
          wsBuf = Buffer.concat([wsBuf, chunk]);
          while (wsBuf.length >= 2) {
            let offset = 2;
            let len = wsBuf[1] & 0x7f;
            if (len === 126) {
              if (wsBuf.length < 4) break;
              len = wsBuf.readUInt16BE(2);
              offset = 4;
            } else if (len === 127) {
              if (wsBuf.length < 10) break;
              len = Number(wsBuf.readBigUInt64BE(2));
              offset = 10;
            }
            if (wsBuf.length < offset + len) break;
            const frame = wsBuf.slice(offset, offset + len).toString('utf8');
            wsBuf = wsBuf.slice(offset + len);

            try {
              const msg = JSON.parse(frame);
              if (msg.method === 'Runtime.exceptionThrown') {
                errors.push(msg.params.exceptionDetails);
              }
              if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
                errors.push(msg.params.message.text);
              }
            } catch(e) {}
          }
        });

        setTimeout(() => {
          console.log('CONSOLE_ERRORS_COUNT:', errors.length);
          if (errors.length > 0) {
            console.error('Errors found:', JSON.stringify(errors, null, 2));
          } else {
            console.log('PASSED_CLEAN_NO_RUNTIME_ERRORS');
          }
          socket.end();
          chrome.kill();
          process.exit(0);
        }, 3500);
      });
      req.end();
    });
  });
}, 2000);
