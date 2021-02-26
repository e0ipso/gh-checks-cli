import { promisify } from 'util';
import { readFile } from 'fs';

export default async function (path: string) {
  return (await promisify(readFile)(path)).toString();
}
