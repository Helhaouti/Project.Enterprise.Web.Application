import {Player} from "../Player";

export abstract class GameAction {
  private _classType: string;
  private _id: number;
  private _actor: Player;
  private _performedAt: Date;

  protected constructor(
    classType: string,
    id: number,
    actor: Player,
    performedAt: Date
  ) {
    this._classType = classType;
    this._id = id;
    this._actor = actor;
    this._performedAt = performedAt;
  }

  get classType(): string {
    return this._classType;
  }

  protected set classType(value: string) {
    this._classType = value;
  }

  public toJson(): object {
    return {
      "classType": this.classType,
      "id": this.id,
      "actor": this.actor?.toJson(),
      "performedAt": this.performedAt,
    }
  }

  get id(): number {
    return this._id;
  }

  get actor(): Player {
    return this._actor;
  }

  get performedAt(): Date {
    return this._performedAt;
  }

  abstract toString(): string;
}
