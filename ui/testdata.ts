import { IncidentGroup } from "./messages";

export const testIncidents: IncidentGroup[] = [
 {
  xCount: 1,
  time: { index: 0, time: 15.5 },
  types: ["Off-Track", "xCount"],
  car: { number: "21", driver: { name: "Brian Pratt2", team: "Brian Pratt2" }},
  incidents: []
 },
 {
  xCount: 4,
  time: { index: 0, time: 125.5 },
  types: ["Caution"],
  car: { number: "18", driver: { name: "Mike Racecar", team: "Mike Racecar" }},
  incidents: []
 }
]