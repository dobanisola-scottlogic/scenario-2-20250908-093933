import { CutoffCondition } from '~/enums/CutoffCondition';
import { Game } from './Game';

export interface GameResult {
  cutoffCondition: CutoffCondition;
  game: Game;
  id: string;
}
