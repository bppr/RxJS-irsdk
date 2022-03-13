
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

export function startServer(onMsg: (data: any) => void) {
  const server = express()
    .use(express.static("./build"));

  const system = new WebSocketServer({ port: 3001 })
  const referral = new WebSocketServer({ port: 3002 })

  system.on('connection', (conn) => {
    conn.on('message', (data) => onMsg(data))
  })

  return { sockets: { system, referral }, server }
}

export function publish<T>({ clients }: WebSocketServer, payload: T) {
  const json = JSON.stringify(payload);
  
  clients.forEach(client => {
    if(client.readyState === WebSocket.OPEN) {
      client.send(json)
    }
  })
}