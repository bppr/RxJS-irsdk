import { MessageItem } from "../components/App";
import { randomId } from "./randomId";

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
    data: {
      car: { number: '18', driver: 'Mike Racecar' },
      time: { index: 0, time: 125.7 },
      flags: ['furled']
    }
  }
]