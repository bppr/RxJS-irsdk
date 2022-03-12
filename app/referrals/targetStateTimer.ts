import { AppState, CarState } from "../state";
import { Incident, IncidentMapper } from '../main';

type TimerRecord = { startTime: number; triggered: boolean; };

type TimerConfig = {
  inTargetState(car: CarState): boolean;
  timeLimit: number;
  onStateEntered?: (car: CarState, state: AppState) => Incident[]; 
  onStateExited?: (car: CarState, state: AppState, duration: number, timeExceeded: boolean) => Incident[];
  onTimeout?: (car: CarState, state: AppState) => Incident[];
}

export function createTargetStateTimer(cfg: TimerConfig): IncidentMapper {
  const config = { ...defaultTimerConfig, ...cfg };
  const records = new Map<number, TimerRecord>();

  return function(__old: AppState, state: AppState): Incident[] {
    const sessionTime = state.session.time;

    return state.cars.flatMap(car => {
      const index = car.index;
      const record = records.get(index);

      const duration = record ? sessionTime - record.startTime : 0;

      if (config.inTargetState(car)) {
        if (!record) {
          records.set(index, { startTime: sessionTime, triggered: false });
          return config.onStateEntered(car, state);
        } else if (duration >= config.timeLimit && !record.triggered) {
          records.set(index, { ...record, triggered: true });
          return config.onTimeout(car, state);
        }
        // implicit else - the duration is not beyond time limit, so we wait
      } else if (record) {
        records.delete(index);
        return config.onStateExited(car, state, duration, record.triggered);
      }

      return [];
    });
  }
}

const defaultTimerConfig = {
  onStateExited: () => [],
  onStateEntered: () => [],
  onTimeout: () => []
};
