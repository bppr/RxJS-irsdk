import _ from 'lodash';

export function update<T>(list: T[], index: number, values: Partial<T>) {
  return _.tap([...list], arr => arr.splice(index, 1, { ...arr[index], ...values }));
}
