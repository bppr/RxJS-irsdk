function __pad(num: number) {
  return num.toString().padStart(2, '0');
}

export function displayTime(decimalTime: number) {
  const sec = Math.round(decimalTime);

  const hours = (sec / (60 * 60)) | 0;
  const minutes = (sec / 60) | 0;
  const seconds = sec - (hours * 60 * 60) - (minutes * 60);

  return `${hours}:${__pad(minutes)}:${__pad(seconds)}`;
}
