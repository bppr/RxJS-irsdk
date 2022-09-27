const socket = new WebSocket(`ws://${window.location.hostname}:3001`);

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ event: 'connected' }));
})

socket.addEventListener('message', (ev) => {
  console.log(JSON.parse(ev.data))
})