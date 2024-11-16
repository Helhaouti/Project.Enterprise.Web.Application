export class CreateGameRequest {
  private readonly _maxPlayers: number;
  private readonly _waitingTime: number;
  private readonly _maxTimeTurn: number;
  private readonly _maxGameTime: number;

  constructor(
    maxPlayers: number,
    waitingTime: number,
    maxTimeTurn: number,
    maxGameTime: number
  ) {
    this._maxPlayers = maxPlayers;
    this._waitingTime = waitingTime;
    this._maxTimeTurn = maxTimeTurn;
    this._maxGameTime = maxGameTime;
  }

  toJson(): object {
    return {
      "maxPlayers": this.maxPlayers,
      "waitingTime": this.waitingTime,
      "maxTimeTurn": this.maxTimeTurn,
      "maxGameTime": this.maxGameTime
    }
  }

  get maxPlayers(): number {
    return this._maxPlayers;
  }

  get waitingTime(): number {
    return this._waitingTime;
  }

  get maxTimeTurn(): number {
    return this._maxTimeTurn;
  }

  get maxGameTime(): number {
    return this._maxGameTime;
  }
}
