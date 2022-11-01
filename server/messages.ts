export type IncidentGroup = {
  xCount: number;
  time: { index: number; time: number; };
  types: string[];
  incidents: IncidentDetail[];
  car: IncidentCar;
};

export type IncidentDetail = {
  type: string;
  xCount: number;
  time: { index: number; time: number; };
  location: { lap: number, lapPct: number };
};

export type IncidentCar = {
  driver: { name: string; team: string; };
  number: string;
};

export type SystemState = {
  session: { index: number; time: number; type: string; };
  replayState: { session: number; time: number; };
  cameraState: { isPaused: boolean; car: { driver: string; number: string; }; };
};

export type Flag = {
  car: { number: string };
  time: { index: number, time: number };
  flags: string[];
};