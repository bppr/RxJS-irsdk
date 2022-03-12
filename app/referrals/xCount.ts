import { AppState } from "../state";
import { Incident } from '../main';

export function xCount(previous: AppState, state: AppState): Incident[] {
  return state.cars.flatMap(car => {
    const prevState = previous.findCar(car.number);

    if(!prevState || car.xCount <= prevState.xCount)
      return [];

    return [{
      car, 
      xCount: car.xCount - prevState.xCount,
      type: "Incident Count",
      time: state.session
    }]
  });
}