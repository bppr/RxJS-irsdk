// this node library doesn't have TS bindings so we'll supply some here
declare module 'node-irsdk-2021' {
  function init(options: { sessionInfoUpdateInterval: number, telemetryUpdateInterval: number }): Client

  type Client = {
    on<T>(ev: string, handler: (t: T) => void)
  }

  interface TelemetryEvent {
    timestamp: Date
    values: Telemetry
  }
  
  interface Telemetry {
    SessionNum: number
    SessionTime: number
    ReplaySessionNum: number
    ReplaySessionTime: number
    ReplayPlaySpeed: number
    CamCarIdx: number
    CarIdxLap: number[]
    CarIdxLapDistPct: number[]
    CarIdxOnPitRoad: boolean[]
    CarIdxTrackSurface: string
  }
  
  interface Driver {
    CarIdx: number
    TeamName: string
    UserName: string
    CarNumber: string
    TeamIncidentCount: number
    CarIsAI: number
    CarIsPaceCar: number
    UserID: number
  }
  
  interface SessionEvent {
    timestamp: Date
    data: SessionInfo
  }
  
  interface SessionInfo {
    DriverInfo: {
      Drivers: Driver[]
    }
    WeekendInfo: {
      TrackName: string
      TrackLength: string
      TrackID: number
      TrackDisplayName: string
      TrackDisplayShortName: string
      TrackConfigName: string
    }
    SessionInfo: {
      Sessions: {
        SessionType: 'Race' | 'Qualifying' | 'Practice' | 'Unknown'
        ResultsFastestLap: {
          CarIdx: number
          FastestLap: number
          FastestTime: number
        }[]
      }[]
    }
  }
}