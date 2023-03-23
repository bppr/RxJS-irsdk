import _ from 'lodash';
import * as SDK from 'node-irsdk-2021';
import { combineLatest, Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';

export type AppState = {
  weekend: { sessions: string[], trackLength: string }
  session: { index: number, time: number, type: string }
  replayState: { session: number, time: number }
  cameraState: { isPaused: boolean, car: { driver: string, number: string }}
  cars: CarState[]
  findCar: (number: string) => CarState | undefined
}

export type AppStateUpdate = { previous: AppState, current: AppState }

export type CarState = {
  index: number
  number: string
  position: number
  flags: string[]
  driver: { name: string, team: string }
  xCount: number
  currentLap: number
  currentLapPct: number
  onPitRoad: boolean
  trackSurface: string
}

const INITIAL_STATE: AppState = {
  weekend: { sessions: [], trackLength: '1.0 km' },
  session: { index: 0, time: 0, type: 'Unknown' },
  replayState: { session: 0, time: 0 },
  cameraState: { isPaused: false, car: { driver: 'None', number: '--'}},
  cars: [],
  findCar: () => undefined
}

export function watch(sdk: SDK.Client): Observable<AppStateUpdate> {
  const telemetrySource = observeSDK<SDK.TelemetryEvent>(sdk, 'Telemetry');
  const sessionSource = observeSDK<SDK.SessionEvent>(sdk, 'SessionInfo');

  let prevState = INITIAL_STATE;

  return combineLatest([telemetrySource, sessionSource]).pipe(
    map(([telemetry, session]) => toAppState(prevState, telemetry.values, session.data)),
    tap(({ current }) => prevState = current),
    share()
  )
}

const nullDriver = { UserName: 'None', CarNumber: '---' };

function toAppState(previous: AppState, telemetry: SDK.TelemetryValues, session: SDK.SessionData): AppStateUpdate {
  const cars = toCarState(telemetry, session);
  const findCar = lookup(cars);
  const camDriver = session.DriverInfo.Drivers[telemetry.CamCarIdx] ?? nullDriver;

  return { 
    previous, 
    current: {
      cars,
      findCar,
      weekend: {
        sessions: session.SessionInfo.Sessions.map((s: {SessionType: string })=> s.SessionType),
        trackLength: session.WeekendInfo.TrackLength
      },
      session: { 
        index: telemetry.SessionNum,
        time: telemetry.SessionTime,
        type: session.SessionInfo.Sessions[telemetry.SessionNum]?.SessionType ?? 'Unknown'
      },
      replayState: {
        session: telemetry.ReplaySessionNum,
        time: telemetry.ReplaySessionTime,
      },
      cameraState: { 
        isPaused: telemetry.ReplayPlaySpeed === 0,
        car: {
          driver: camDriver.UserName,
          number: camDriver.CarNumber
        }
      }
    }
  }
}

function toCarState(telemetry: SDK.TelemetryValues, session: SDK.SessionData): CarState[] {
  return session.DriverInfo.Drivers.map(driver => {
    const index = driver.CarIdx;

    return {
      index,
      number: driver.CarNumber,
      position: telemetry.CarIdxPosition[index],
      driver: { name: driver.UserName, team: driver.TeamName},
      flags: telemetry.CarIdxSessionFlags[index],
      xCount: driver.TeamIncidentCount,
      currentLap: telemetry.CarIdxLap[index] ?? 0,
      currentLapPct: telemetry.CarIdxLapDistPct[index] ?? -1,
      onPitRoad: telemetry.CarIdxOnPitRoad[index] ?? false,
      trackSurface: telemetry.CarIdxTrackSurface[index] ?? 'NotInWorld'
    }
  })
}

function lookup(cars: CarState[]) {
  const table = _.groupBy(cars, 'number')
  return (num: string) => (table[num] ?? [])[0]
}

function observeSDK<T>(sdk: SDK.Client, evName: string): Observable<T> {
  return new Observable<T>(o => sdk.on<T>(evName, (data) => o.next(data)))
}