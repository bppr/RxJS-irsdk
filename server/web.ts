import express from 'express';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import * as SDK from 'node-irsdk-2021';
import * as path from 'path';

export function initWeb(irsdk: SDK.Client) {
  const server = express()
    .use(express.static(path.join(__dirname, "../ui")));

  const ws = new WebSocketServer({ port: 3001 })
  const inbox = createInbox(irsdk);

  ws.on('connection', (conn) => {
    console.log('client added');
    
    conn.on('message', data => inbox(data));
    conn.on('close', () => console.log('client removed'));
  })

  return { 
    publish: <T>(type: string, data: T) => send(ws, { type, data }), 
    run: () => server.listen(3000, () => console.log("server started: http://localhost:3000"))
  };
}

export function send<T>(ws: WebSocketServer, payload: T) {
  const json = JSON.stringify(payload);
  
  ws.clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(json)
    }
  })
}

export function createInbox(irsdk: SDK.Client) {
  return (raw: RawData) => {
    const { command, data } = JSON.parse(raw.toString('utf-8'));

    const commands: {[key: string]: () => void} = {
      'pause': () => irsdk.playbackControls.pause(),
      'play': () => irsdk.playbackControls.play(),
      'go-live': () => irsdk.playbackControls.search("ToEnd"),
      'focus-car': () => irsdk.camControls.switchToCar(data.carNumber),
      'replay': () => {
        const sessionMs = (data.sessionTime * 1000) | 0;
               
        irsdk.camControls.switchToCar(data.carNumber);
        irsdk.playbackControls.searchTs(data.sessionIndex, Math.max(sessionMs - 4000, 0))
      }
    };

    const handler = commands[command] ?? (() => {})

    handler();
  }
}