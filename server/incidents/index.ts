import { detectCautionIncidents } from "./cautions";
import { xCount } from "./xCount";
import { offTrack } from './offTrack';

import { AppState, AppStateUpdate, CarState } from "../state";

type Incident = {
  car: CarState;
  xCount?: number;
  time: { index: number; time: number; };
  type: string;
};

type IncidentMapper = (previous: AppState, current: AppState) => Incident[];

const mappers = [
  xCount, 
  offTrack({ timeLimit: 1.0, rejoinRange: 10 })
];

function detectIncidents(update: AppStateUpdate) {
  return mappers.flatMap(m => m(update.previous, update.current))
}

export {
  detectCautionIncidents,
  detectIncidents,
  xCount,
  offTrack,
  Incident,
  IncidentMapper,
  mappers
}