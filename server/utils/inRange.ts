type CarOnLap = { currentLapPct: number, number: string }

export function inRange(car: CarOnLap, otherCar: CarOnLap, range: number) {
  const theirLoc = otherCar.currentLapPct;
  return car.number !== otherCar.number
    && insideTrackRange(car.currentLapPct, theirLoc - range, theirLoc + range);
}

function insideTrackRange(value: number, min: number, max: number): boolean {
  // modulo all values to get them between 0 and 1
  value -= Math.floor(value);
  min -= Math.floor(min);
  max -= Math.floor(max);

  // adjust min and max so that they're in the proper order
  if (max < min)
    max += 1.0;

  return (value >= min && value <= max) ||
    ((value + 1) >= min && (value + 1) <= max);
}
