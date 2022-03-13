import * as SDK from 'node-irsdk-2021';
import { map, mergeMap, groupBy, bufferTime, filter, throttleTime } from 'rxjs/operators';
import { watch, CarState, AppState } from "./state";
import { xCount } from './referrals/xCount';
import { offTrack } from './referrals/offTrack';
import { sumBy } from 'lodash';

export type Incident = {
  car: CarState
  xCount?: number
  time: { index: number, time: number }
  type: string
}

export type IncidentMapper = (previous: AppState, current: AppState) => Incident[]

export function initializeStreams(irsdk: SDK.Client) {
  const incidentMappers = [xCount, offTrack({ timeLimit: 2.0, rejoinRange: 10 })];
  const stream = watch(irsdk);

  const clock = stream.pipe(
    map(({ current }) => current.session),
    throttleTime(500)  
  );

  const referrals = stream.pipe(
    mergeMap(update => incidentMappers.flatMap(im => im(update.previous, update.current))),
    groupBy(incident => incident.car.number),
    mergeMap(group => group.pipe(bufferTime(2000))),
    filter(incidents => sumBy(incidents, i => i.xCount ?? 0) > 0),
    map(incidents => ({ car: incidents[0].car, incidents }))
  );

  return { clock, referrals };
}
