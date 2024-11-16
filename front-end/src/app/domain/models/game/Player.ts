import {User} from "../user.model";
import {JailBreakCard} from "./card/impl/JailBreakCard";
import {OwnableLocation} from "./board/location/OwnableLocation";
import {CardUtil} from "./card/CardUtil";
import {LocationUtil} from "./board/location/LocationUtil";
import {OwnableLocationBid} from "./board/location/OwnableLocationBid";
import {JailBreakCardBid} from "./card/impl/JailBreakCardBid";
import {GameAssetBidUtil} from "./GameAssetBidUtil";

export class Player {
  private _id: number;
  private _user: User;
  private _money: number;
  private _position: number;

  /**
   * 0: Meaning that the person is not in jail.
   * 1: First round in Jail.
   * 2: Second round in Jail.
   * ...
   */
  private _roundsInJail: number;
  private _properties: OwnableLocation[];
  private _cards: JailBreakCard[];
  private _gameAdmin: boolean;
  private _bankrupt: boolean;
  private _turnNumber: number;

  public constructor(
    id: number,
    user: User,
    money: number,
    position: number,
    roundsInJail: number,
    properties: OwnableLocation[],
    cards: JailBreakCard[],
    gameAdmin: boolean,
    bankrupt: boolean,
    turnNumber: number,
    receivedLocationBids: OwnableLocationBid[],
    receivedJailBreakCardBids: JailBreakCardBid[],
    performedLocationBids: OwnableLocationBid[],
    performedJailBreakCardBids: JailBreakCardBid[]
  ) {
    this._id = id;
    this._user = user;
    this._money = money;
    this._position = position;
    this._roundsInJail = roundsInJail;
    this._properties = properties;
    this._cards = cards;
    this._gameAdmin = gameAdmin;
    this._bankrupt = bankrupt;
    this._turnNumber = turnNumber;
    this._receivedLocationBids = receivedLocationBids;
    this._receivedJailBreakCardBids = receivedJailBreakCardBids;
    this._performedLocationBids = performedLocationBids;
    this._performedJailBreakCardBids = performedJailBreakCardBids;
  }

  private _receivedLocationBids: OwnableLocationBid[];

  get receivedLocationBids(): OwnableLocationBid[] {
    return this._receivedLocationBids;
  }

  set receivedLocationBids(value: OwnableLocationBid[]) {
    this._receivedLocationBids = value;
  }

  private _receivedJailBreakCardBids: JailBreakCardBid[];

  get receivedJailBreakCardBids(): JailBreakCardBid[] {
    return this._receivedJailBreakCardBids;
  }

  set receivedJailBreakCardBids(value: JailBreakCardBid[]) {
    this._receivedJailBreakCardBids = value;
  }

  private _performedLocationBids: OwnableLocationBid[];

  get performedLocationBids(): OwnableLocationBid[] {
    return this._performedLocationBids;
  }

  set performedLocationBids(value: OwnableLocationBid[]) {
    this._performedLocationBids = value;
  }

  private _performedJailBreakCardBids: JailBreakCardBid[];

  get performedJailBreakCardBids(): JailBreakCardBid[] {
    return this._performedJailBreakCardBids;
  }

  set performedJailBreakCardBids(value: JailBreakCardBid[]) {
    this._performedJailBreakCardBids = value;
  }

  public get id(): number {
    return this._id;
  }

  public get user(): User {
    return this._user;
  }

  public get money(): number {
    return this._money;
  }

  public set money(value: number) {
    this._money = value;
  }

  public get position(): number {
    return this._position;
  }

  public set position(value: number) {
    this._position = value;
  }

  public get roundsInJail(): number {
    return this._roundsInJail;
  }

  public set roundsInJail(value: number) {
    this._roundsInJail = value;
  }

  public get properties(): OwnableLocation[] {
    return this._properties;
  }

  public set properties(value: OwnableLocation[]) {
    this._properties = value;
  }

  public get cards(): JailBreakCard[] {
    return this._cards;
  }

  public set cards(value: JailBreakCard[]) {
    this._cards = value;
  }

  public get gameAdmin(): boolean {
    return this._gameAdmin;
  }

  public get bankrupt(): boolean {
    return this._bankrupt;
  }

  public set bankrupt(value: boolean) {
    this._bankrupt = value;
  }

  public get turnNumber(): number {
    return this._turnNumber;
  }

  public static trueCopy(player: Player): Player {
    return new Player(
      player.id,
      User.trueCopy(player.user),
      player.money,
      player.position,
      player.roundsInJail,
      player.properties.map(loc => <OwnableLocation>LocationUtil.trueCopy(loc)),
      player.cards.map(item => <JailBreakCard>CardUtil.trueCopy(item)),
      player.gameAdmin,
      player.bankrupt,
      player.turnNumber,
      <OwnableLocationBid[]>player.receivedLocationBids.map(GameAssetBidUtil.trueCopy),
      <JailBreakCardBid[]>player.receivedJailBreakCardBids.map(GameAssetBidUtil.trueCopy),
      <OwnableLocationBid[]>player.performedLocationBids.map(GameAssetBidUtil.trueCopy),
      <JailBreakCardBid[]>player.performedJailBreakCardBids.map(GameAssetBidUtil.trueCopy)
    );
  }

  public static compareRank(p1: Player, p2: Player): number {
    let p1NetWorth: number = p1.money;
    p1.properties.forEach(property => p1NetWorth += property.initialPurchasePrice);

    let p2NetWorth: number = p2.money;
    p2.properties.forEach(property => p2NetWorth += property.initialPurchasePrice);

    return p2NetWorth - p1NetWorth;
  }

  public toJson(): object {
    return {
      "id": this.id,
      "user": this.user.toJson(),
      "money": this.money,
      "position": this.position,
      "roundsInJail": this.roundsInJail,
      "properties": this.properties.map(location => location.toJson()),
      "mortgagedProperties": this.properties.map(location => location.toJson()),
      "cards": this.cards.map(item => item.toJson()),
      "gameAdmin": this.gameAdmin,
      "bankrupt": this.bankrupt,
      "turnNumber": this.turnNumber,
      "receivedLocationBids": this._receivedLocationBids.map(item => item.toJson()),
      "receivedJailBreakCardBids": this._receivedJailBreakCardBids.map(item => item.toJson()),
      "performedLocationBids": this._performedLocationBids.map(item => item.toJson()),
      "performedJailBreakCardBids": this._performedJailBreakCardBids.map(item => item.toJson())
    }
  }
}
