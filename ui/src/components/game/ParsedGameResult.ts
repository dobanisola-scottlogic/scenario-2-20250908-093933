import { ParsedGameConstants } from '~/components/game/ParsedGameConstants';
import { ParsedGameDelta } from '~/components/game/ParsedGameDelta';
import { ParsedGameState } from '~/components/game/ParsedGameState';
import { GameResult } from '~/interfaces/GameResult';

export class ParsedGameResult {
  private constructor(
    public readonly constants: ParsedGameConstants,
    public readonly deltas: ParsedGameDelta[],
    public readonly states: ParsedGameState[]
  ) {}

  public static parse = (gameResult: GameResult): ParsedGameResult => {
    const constants = ParsedGameConstants.parse(gameResult);
    const deltas = ParsedGameDelta.parseMany(gameResult, constants);
    const states = ParsedGameState.parseMany(gameResult, constants);

    return new ParsedGameResult(constants, deltas, states);
  };
}
