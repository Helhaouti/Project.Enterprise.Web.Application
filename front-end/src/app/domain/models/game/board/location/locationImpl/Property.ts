import {OwnableLocation} from "../OwnableLocation";

export enum PropertyDevelopmentStage {
  NO_DEVELOPMENT = "NO_DEVELOPMENT",
  ONE_HOUSE = "ONE_HOUSE",
  TWO_HOUSES = "TWO_HOUSES",
  THREE_HOUSES = "THREE_HOUSES",
  FOUR_HOUSES = "FOUR_HOUSES",
  HOTEL = "HOTEL"
}

export enum PropertyColor {
  LIGHT_BLUE = "light-blue",
  DARK_PURPLE = "dark-purple",
  ORANGE = "orange",
  PURPLE = "purple",
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  DARK_BLUE = "dark-blue",
}

export class Property extends OwnableLocation {
  public static readonly DEVELOPMENT_LEVELS = [
    {level: 0, key: PropertyDevelopmentStage.NO_DEVELOPMENT, value: "no development"},
    {level: 1, key: PropertyDevelopmentStage.ONE_HOUSE, value: "1 house"},
    {level: 2, key: PropertyDevelopmentStage.TWO_HOUSES, value: "2 houses"},
    {level: 3, key: PropertyDevelopmentStage.THREE_HOUSES, value: "3 houses"},
    {level: 4, key: PropertyDevelopmentStage.FOUR_HOUSES, value: "4 houses"},
    {level: 5, key: PropertyDevelopmentStage.HOTEL, value: "1 Hotel (No houses)"}
  ];

  private _color: PropertyColor;
  private _name: string;
  private _propertyDevelopmentCost: number;
  private _rentWithNoHouse: number;
  private _rentWithOneHouse: number;
  private _rentWithTwoHouses: number;
  private _rentWithThreeHouses: number;
  private _rentWithFourHouses: number;
  private _rentWithHotel: number;

  public constructor(
    id: number,
    position: number,
    description: string,
    initialPurchasePrice: number,
    color: PropertyColor,
    name: string,
    mortgageValue: number,
    propertyDevelopmentCost: number,
    rentWithNoHouse: number,
    rentWithOneHouse: number,
    rentWithTwoHouses: number,
    rentWithThreeHouses: number,
    rentWithFourHouses: number,
    rentWithHotel: number
  ) {
    super(Property.name, id, position, description, initialPurchasePrice, mortgageValue);
    this._color = color;
    this._name = name;
    this._propertyDevelopmentCost = propertyDevelopmentCost;
    this._rentWithNoHouse = rentWithNoHouse;
    this._rentWithOneHouse = rentWithOneHouse;
    this._rentWithTwoHouses = rentWithTwoHouses;
    this._rentWithThreeHouses = rentWithThreeHouses;
    this._rentWithFourHouses = rentWithFourHouses;
    this._rentWithHotel = rentWithHotel;
  }

  public get color(): PropertyColor {
    return this._color;
  }

  public static trueCopy(location: Property): Property | null {
    return new Property(
      location.id,
      location.position,
      location.description,
      location.initialPurchasePrice,
      PropertyColor[location.color],
      location.name,
      location.mortgageValue,
      location.propertyDevelopmentCost,
      location.rentWithNoHouse,
      location.rentWithOneHouse,
      location.rentWithTwoHouses,
      location.rentWithThreeHouses,
      location.rentWithFourHouses,
      location.rentWithHotel,
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(),
      {
        "color": this.color,
        "name": this.name,
        "mortgageValue": this.mortgageValue,
        "propertyDevelopmentCost": this.propertyDevelopmentCost,
        "rentWithNoHouse": this.rentWithNoHouse,
        "rentWithOneHouse": this.rentWithOneHouse,
        "rentWithTwoHouses": this.rentWithTwoHouses,
        "rentWithThreeHouses": this.rentWithThreeHouses,
        "rentWithFourHouses": this.rentWithFourHouses,
        "rentWithHotel": this.rentWithHotel,
      }
    );
  }

  public get name(): string {
    return this._name;
  }

  public get propertyDevelopmentCost(): number {
    return this._propertyDevelopmentCost;
  }

  public get rentWithNoHouse(): number {
    return this._rentWithNoHouse;
  }

  public get rentWithOneHouse(): number {
    return this._rentWithOneHouse;
  }

  public get rentWithTwoHouses(): number {
    return this._rentWithTwoHouses;
  }

  public get rentWithThreeHouses(): number {
    return this._rentWithThreeHouses;
  }

  public get rentWithFourHouses(): number {
    return this._rentWithFourHouses;
  }

  public get rentWithHotel(): number {
    return this._rentWithHotel;
  }

  public static propertyDevelopmentStageDescriber(stage: PropertyDevelopmentStage): string {
    switch (stage) {
      case PropertyDevelopmentStage.NO_DEVELOPMENT:
        return "No house or hotel"
      case PropertyDevelopmentStage.ONE_HOUSE:
        return "One house"
      case PropertyDevelopmentStage.TWO_HOUSES:
        return "Tho houses"
      case PropertyDevelopmentStage.THREE_HOUSES:
        return "Three houses"
      case PropertyDevelopmentStage.FOUR_HOUSES:
        return "Four houses"
      case PropertyDevelopmentStage.HOTEL:
        return "One hotel"
      default:
        return ""
    }
  }

  public override toString(): string {
    return this.name;
  }

}
