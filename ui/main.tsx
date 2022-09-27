import React from 'react';
import ReactDOM from 'react-dom';

const PORT = 3001;

function App(props: { socket: WebSocket }) {
  return <h1>Hello</h1>;
}

function main() {
  const root = document.getElementById('app-root');
  const socket = new WebSocket(`ws://${window.location.hostname}:${PORT}`);
  
  ReactDOM.render(<App socket={socket} />, root);  
}

main();