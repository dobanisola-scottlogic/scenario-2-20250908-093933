import { CutoffCondition } from './CutoffCondition';
import { Game } from './Game';

export interface GameResult {
  cutoffCondition: CutoffCondition;
  game: Game;
  id: string;
}
