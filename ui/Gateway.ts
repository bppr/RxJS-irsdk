export interface Gateway {
  play(): void
  pause(): void
  goLive(): void
  focusCar(carNumber: string): void
  replay(sessionIndex: number, sessionTime: number, carNumber: string): void
  onMsg(handler: (data: any) => void): void
}

export function createGateway(port: number): Gateway {
  const socket = new WebSocket(`ws://${window.location.hostname}:${port}`)

  function __send<T>(data: T) {
    socket.send(JSON.stringify(data))
  }

  return {
    play() { __send({ command: 'play' }) },
    pause() { __send({ command: 'pause' }) },
    goLive() { __send({ command: 'go-live' }) },

    focusCar(carNumber: string) {
      __send({ command: 'focus-car', data: { carNumber } })
    },

    replay(sessionIndex: number, sessionTime: number, carNumber: string) {
      __send({ command: 'replay', data: { sessionIndex, sessionTime, carNumber } })
    },

    onMsg(handler: (data: any) => void) {
      socket.addEventListener('message', (ev) => {
        handler(JSON.parse(ev.data))
      })
    }
  }
}
