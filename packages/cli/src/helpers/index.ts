import * as path from 'path';

export function resolveOwn(relativePath: string) {
  return path.resolve(__dirname, '..', relativePath);
}
