export class UpdateGameRequest {
  private readonly _maxTimeTurn: number;
  private readonly _maxGameTime: number;

  constructor(
    maxTimeTurn: number,
    maxGameTime: number
  ) {
    this._maxTimeTurn = maxTimeTurn;
    this._maxGameTime = maxGameTime;
  }

  toJson(): object {
    return {
      "maxTimeTurn": this.maxTimeTurn,
      "maxGameTime": this.maxGameTime
    }
  }

  get maxTimeTurn(): number {
    return this._maxTimeTurn;
  }

  get maxGameTime(): number {
    return this._maxGameTime;
  }
}
