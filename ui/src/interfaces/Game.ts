import { Arena } from './Arena';
import { GameTeam } from './GameTeam';

export interface Game {
  arena: Arena;
  gameTime: number;
  hackathonId: string;
  map: Arena;
  teams: GameTeam[];
  title?: string;
}
