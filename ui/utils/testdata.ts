
import { SystemState } from "server/messages";
import { MessageItem } from "../components/App";
import { randomId } from "./randomId";

// export const testIncidents: MessageItem[] = []

export const testIncidents: MessageItem[] = [
  {
    type: 'incident',
    id: randomId(),
    archived: false,
    data: {
      xCount: 1,
      time: { index: 0, time: 15.5 },
      types: ["Off-Track", "xCount"],
      car: { number: "21", driver: { name: "Brian Pratt2", team: "Brian Pratt2" }},
      incidents: [
        {
          type: 'xCount',
          xCount: 1,
          time: { index: 0, time: 15.5 },
          location: { lap: 1, lapPct: 0.5 }
        }
      ]
    }
  },
  {
    type: 'incident',
    id: randomId(),
    archived: false,
    data: {
      xCount: 4,
      time: { index: 0, time: 125.5 },
      types: ["Caution"],
      car: { number: "18", driver: { name: "Mike Racecar", team: "Mike Racecar" }},
      incidents: [
        {
          type: 'xCount',
          xCount: 1,
          time: { index: 0, time: 125.5 },
          location: { lap: 2, lapPct: 0.72 }
        }
      ]
    }
  },
  {
    type: 'flag',
    id: randomId(),
    archived: false, 
    data: [{
      car: { number: '18', driver: 'Mike Racecar'},
      time: { index: 0, time: 125.7 },
      flags: ['Furled']
    }]
  }
]

export const testSystem: SystemState = {
  session: { index: 0, time: 0, type: "Unknown" },
  replayState: { session: 0, time: 0 },
  cameraState: { isPaused: true, car: { driver: 'None', number: '---' } },
  cars: [
    {
      index: 0,
      number: '18',
      position: 1,
      flags: [],
      driver: {name: 'Mike Racecar', team: ''},
      xCount: 4,
      currentLap: 42,
      currentLapPct: 0.591,
      onPitRoad: false,
      trackSurface: ''
    },
    {
      index: 1,
      number: '21',
      position: 2,
      flags: [],
      driver: {name: 'Brian Pratt2', team: 'Brian Pratt2'},
      xCount: 3,
      currentLap: 42,
      currentLapPct: 0.549,
      onPitRoad: false,
      trackSurface: ''
    }
  ]
};