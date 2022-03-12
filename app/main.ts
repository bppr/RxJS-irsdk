import * as SDK from 'node-irsdk-2021'
import { map, mergeMap, groupBy, bufferTime, filter, throttleTime, share } from 'rxjs/operators'

import { watch, CarState, AppState } from "./state"
import { xCount } from './referrals/xCount'
import { offTrack } from './referrals/offTrack'
import { sumBy } from 'lodash'

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
    map(({ current }) => current.session),
    throttleTime(1000)
  )
  
  const referrals = stream.pipe(
    mergeMap(update => incidentMappers.flatMap(im => im(update.previous, update.current))),
    groupBy(incident => incident.car.number),
    mergeMap(group => group.pipe(bufferTime(2000))),
    filter(incidents => sumBy(incidents, i => i.xCount ?? 0) > 0),
    map(incidents => ({ car: incidents[0].car, incidents }))
  )

  clock.subscribe(session => console.log('clock', [session.index, session.time]));

  referrals.subscribe(r => 
    console.log('referral', r.car.number, r.incidents.map(i => i.xCount))
  );
}