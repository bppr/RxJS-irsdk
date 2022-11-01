import _, { sumBy } from 'lodash';
import * as SDK from 'node-irsdk-2021';
import { bufferTime, filter, groupBy, map, mergeMap, throttleTime } from 'rxjs/operators';

import { detectIncidents, detectCautionIncidents, Incident } from './incidents';
import { detectFlags } from './flags';
import { AppStateUpdate, watch } from "./state";
import { IncidentGroup, SystemState } from "./messages";

export function streams(irsdk: SDK.Client) {
  const stream = watch(irsdk)

  const system = stream.pipe(
    map(mapSystemData),
    throttleTime(1000)
  )

  const flags = stream.pipe(
    map(detectFlags),
    filter(fs => fs.length > 0)
  )

  const incidents = stream.pipe(
    mergeMap(detectIncidents),
    groupBy(incident => incident.car.number),
    mergeMap(group => group.pipe(bufferTime(2000))),
    filter(i => sumBy(i, 'xCount') > 0),
    map(mapIncidentData),
  )

  const cautions = stream.pipe(
    mergeMap(detectCautionIncidents()),
    bufferTime(500),
    filter(buffered => buffered.length > 1),
    map(i => ({ cars: i.map(i => i.car.number), location: i[0].car.currentLapPct }))
  )

  return { system, incidents, flags, cautions };
}

function mapSystemData({ current: { session, replayState, cameraState }}: AppStateUpdate): SystemState { 
  return { session, replayState, cameraState }
}

function mapIncidentData(incidents: Incident[]): IncidentGroup {
  const { driver, number } = incidents[0].car
  
  return {
    xCount: sumBy(incidents, 'xCount'),
    time: incidents[0].time,
    types: incidents.map(i => i.type),
    incidents: incidents.map(({ type, xCount, car, time }) => ({
      type,
      xCount: xCount ?? 0,
      time,
      location: { lap: car.currentLap, lapPct: car.currentLapPct }
    })),
    car: { driver, number }
  }
}