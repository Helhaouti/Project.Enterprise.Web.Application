import {GameAction} from "./action/GameAction";
import {Player} from "./Player";
import {GameActionUtil} from "./action/GameActionUtil";
import {GameBoard} from "./board/GameBoard";
import {PropertyDevelopmentStageTracker} from "./board/location/locationImpl/PropertyDevelopmentStageTracker";

export enum GameSessionState {
  JOINABLE = "JOINABLE",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED"
}

export class GameSession {
  private _id: number;

  constructor(
    id: number,
    maxPlayers: number,
    startsAt: Date,
    maxTimeTurn: number,
    endsAt: Date,
    players: Player[],
    actions: GameAction[],
    creator: string,
    state: GameSessionState,
    gameBoard: GameBoard,
    currentTurn: number,
    propertyDevelopments: PropertyDevelopmentStageTracker[]
  ) {
    this._id = id;
    this._maxPlayers = maxPlayers;
    this._startsAt = startsAt;
    this._maxTimeTurn = maxTimeTurn;
    this._endsAt = endsAt;
    this._players = players;
    this._actions = actions;
    this._creator = creator;
    this._state = state;
    this._gameBoard = gameBoard;
    this._currentTurn = currentTurn;
    this._propertyDevelopments = propertyDevelopments;
  }

  private _startsAt: Date;

  /**
   * Maximum amount of players. Min=2. Max=4.
   */
  private _maxPlayers: number;

  private _endsAt: Date;

  public get maxPlayers(): number {
    return this._maxPlayers;
  }

  /**
   * Time between turns in minutes.
   */
  private _maxTimeTurn: number;

  public get maxTimeTurn(): number {
    return this._maxTimeTurn;
  }

  private _gameBoard: GameBoard;

  public get gameBoard(): GameBoard {
    return this._gameBoard;
  }

  private _currentTurn: number;

  public get currentTurn(): number {
    return this._currentTurn;
  }

  public set currentTurn(value: number) {
    this._currentTurn = value;
  }

  private _players: Player[];

  public get players(): Player[] {
    return this._players;
  }

  public set players(value: Player[]) {
    this._players = value;
  }

  private _actions: GameAction[];

  public get actions(): GameAction[] {
    return this._actions;
  }

  public set actions(value: GameAction[]) {
    this._actions = value;
  }

  private _creator: string;

  public get creator(): string {
    return this._creator;
  }

  private _propertyDevelopments: PropertyDevelopmentStageTracker[];

  public get propertyDevelopments(): PropertyDevelopmentStageTracker[] {
    return this._propertyDevelopments;
  }

  public get id(): number {
    return this._id;
  }

  public get endsAt(): Date {
    return this._endsAt;
  }

  private _state: GameSessionState;

  public get state(): GameSessionState {
    return this._state;
  }

  public get startsAt(): Date {
    return this._startsAt;
  }

  public static trueCopy(session: GameSession): GameSession {
    return new GameSession(
      session.id,
      session.maxPlayers,
      new Date(session.startsAt),
      session.maxTimeTurn,
      new Date(session.endsAt),
      session.players.map(Player.trueCopy),
      session.actions.map(GameActionUtil.trueCopy),
      session.creator,
      session.state,
      GameBoard.trueCopy(session.gameBoard),
      session.currentTurn,
      session.propertyDevelopments.map(PropertyDevelopmentStageTracker.trueCopy)
    );
  }

  public toJson(): object {
    return {
      "id": this.id,
      "maxPlayers": this.maxPlayers,
      "startsAt": this.startsAt.toJSON(),
      "maxTimeTurn": this.maxTimeTurn,
      "endsAt": this.endsAt.toJSON(),
      "players": this.players.map(item => item.toJson()),
      "actions": this.actions.map(item => item.toJson()),
      "state": this.state,
      "gameBoard": this.gameBoard.toJson(),
      "currentTurn": this.currentTurn,
      "propertyDevelopments": this.propertyDevelopments.map(item => item.toJson)
    }
  }
}
