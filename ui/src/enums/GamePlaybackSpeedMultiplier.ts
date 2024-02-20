export enum GamePlaybackSpeedMultiplier {
  Times8 = 8,
  Times4 = 4,
  Times2 = 2,
  Times1 = 1,
  Times05 = 0.5,
  Times025 = 0.25,
}

export class GamePlaybackSpeedMultiplierUtils {
  public static getAllValuesAscending = (): number[] => {
    return Object.entries(GamePlaybackSpeedMultiplier)
      .map(([, value]) => value)
      .filter((value): value is number => typeof value === 'number')
      .sort();
  };
}
