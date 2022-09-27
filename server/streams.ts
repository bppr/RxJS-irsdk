import { sumBy } from 'lodash';
import * as SDK from 'node-irsdk-2021';
import { bufferTime, filter, groupBy, map, mergeMap, throttleTime } from 'rxjs/operators';

import { detectIncidents, detectCautionIncidents } from './incidents';
import { detectFlags } from './flags';
import { watch } from "./state";

// TODO: send a little bit less data :)
export function streams(irsdk: SDK.Client) {
  const stream = watch(irsdk);

  const clock = stream.pipe(
    map(({ current }) => current.session),
    throttleTime(1000)
  );

  const flags = stream.pipe(
    map(detectFlags),
    filter(flags => flags.length > 0)
  );

  // a group of minor incidents within 2s of one another for each car
  const incidents = stream.pipe(
    mergeMap(detectIncidents),
    groupBy(incident => incident.car.number),
    mergeMap(group => group.pipe(bufferTime(2000))),
    filter(incidents => sumBy(incidents, i => i.xCount ?? 0) > 0),
    map(incidents => ({ car: incidents[0].car, incidents }))
  );

  const cautions = stream.pipe(
    mergeMap(detectCautionIncidents()),
    bufferTime(500),
    filter(buffered => buffered.length > 1),
    map(i => ({ cars: i.map(i => i.car.number), location: i[0].car.currentLapPct }))
  )

  return { clock, incidents, flags, cautions };
}