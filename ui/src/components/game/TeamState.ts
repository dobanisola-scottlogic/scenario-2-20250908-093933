export class TeamState {
  constructor(
    public readonly disqualificationReason: string | undefined,
    public readonly owner: number,
    public readonly teamIndex: number,
    public playerCount = 0,
    public spawnCount = 0
  ) {}
}
