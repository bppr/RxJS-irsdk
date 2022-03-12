import * as SDK from 'node-irsdk-2021'
import { pipe } from 'rxjs';
import { map, mergeMap, groupBy, bufferTime, filter, distinctUntilChanged, throttleTime, tap, share } from 'rxjs/operators'
import { sumBy } from 'lodash'

import { watch, CarState, AppState, AppStateUpdate } from "./state"
import { xCount } from './referrals/xCount'
import { offTrack } from './referrals/offTrack'

export type Incident = {
  car: CarState
  xCount?: number
  time: { index: number, time: number }
  type: string
}

export type IncidentMapper = (previous: AppState, current: AppState) => Incident[]

export function main() {
  const incidentMappers = [xCount, offTrack({ timeLimit: 2.0, rejoinRange: 10 })]

  const irsdk = SDK.init({
    sessionInfoUpdateInterval: 100,
    telemetryUpdateInterval: 50,
  })  
  
  irsdk.on('Connected', () => console.log('Connection!'))

  const stream = watch(irsdk)
    .pipe(share()); // share allows us to multicast to many streams without recomputing appState

  const clock = stream.pipe(
    map(({ current }) => current.currentSession),
    throttleTime(1000)
  )
  
  const referrals = stream.pipe(
    mergeMap(({ previous, current }) => incidentMappers.flatMap(m => m(previous, current))),
    groupBy(incident => incident.car.number),
    mergeMap(group => group.pipe(bufferTime(2000))),
    filter(incidents => incidents.length > 0)
  )

  clock.subscribe(session => console.log('clock', [session.index, session.time]));
  referrals.subscribe(r => console.log('referral', r[0].car.number, r.map(i => i.xCount)));
}