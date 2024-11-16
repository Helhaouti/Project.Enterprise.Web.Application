import {Location} from "./location/Location";
import {LocationUtil} from "./location/LocationUtil";
import {Card} from "../card/Card";
import {CardUtil} from "../card/CardUtil";

export class GameBoard {
  public static readonly FIRST_POSITION: number = 1;
  public static readonly LAST_POSITION: number = 40;

  private _id: number;
  private _name: string;
  private _locations: Location[];

  public constructor(
    id: number,
    name: string,
    locations: Location[],
    cards: Card[]
  ) {
    this._id = id;
    this._name = name;
    this._locations = locations;
    this._cards = cards;
  }

  private _cards: Card[];

  public get cards(): Card[] {
    return this._cards;
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get locations(): Location[] {
    return this._locations;
  }

  public static trueCopy(gameboard: GameBoard): GameBoard {
    return new GameBoard(
      gameboard.id,
      gameboard.name,
      gameboard.locations.map(location => LocationUtil.trueCopy(location)),
      gameboard.cards.map(card => CardUtil.trueCopy(card))
    );
  }

  public toJson(): object {
    return {
      "id": this.id,
      "name": this.name,
      "locations": this.locations.map(location => location.toJson()),
      "cards": this.cards.map(card => card.toJson())
    }
  }

}
