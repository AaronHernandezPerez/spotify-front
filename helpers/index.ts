type ReduceFilterReturn<T> = [T[], T[]];

/**
 * Filters and returns and tuple with an array of the elements that pass the conditions and the ones that don't
 */
export function reduceFilter<T>(arr: T[], filter: (e: T) => boolean) {
  const initialValue: ReduceFilterReturn<T> = [[], []];
  return arr.reduce((acc, current) => {
    if (filter(current)) {
      acc[0].push(current);
    } else {
      acc[1].push(current);
    }
    return acc;
  }, initialValue);
}

export function millisToMinutesAndSeconds(millis: number) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  // @ts-expect-error
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
