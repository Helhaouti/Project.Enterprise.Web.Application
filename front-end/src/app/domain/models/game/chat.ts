import {User} from "../user.model";

export class Chat {
  private _id: number;
  private _message: string;
  private _user: User;
  private _gameId: number;
  private _time: Date;

  constructor(message: string, user: User, gameId: number, time: Date) {
    this._message = message;
    this._user = user;
    this._gameId = gameId;
    this._time = new Date(time);
  }

  toJson(): object {
    return {
      "id": this.id,
      "message": this.message,
      "user": this.user.toJson(),
      "gameId": this.gameId,
      "time": this.time
    }
  }

  get id(): number {
    return this._id;
  }

  get message(): string {
    return this._message;
  }

  get user(): User {
    return this._user;
  }

  get gameId(): number {
    return this._gameId;
  }

  get time(): String {
    return new Date(this._time).toLocaleTimeString();
  }
}
