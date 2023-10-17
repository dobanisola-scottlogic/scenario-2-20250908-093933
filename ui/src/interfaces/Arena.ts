import { Position } from './Position';

export interface Arena {
  height: number;
  name: string;
  outOfBoundPositions: Position[];
  width: number;
}
