const socket = new WebSocket('ws://127.0.0.1:3001');

socket.addEventListener('open', () => {
  socket.send('SUP');
})

socket.addEventListener('message', (ev) => {
  console.log('message from server', ev.data)
})