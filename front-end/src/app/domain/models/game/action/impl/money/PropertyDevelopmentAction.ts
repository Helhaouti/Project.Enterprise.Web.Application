import {Property, PropertyDevelopmentStage} from "../../../board/location/locationImpl/Property";
import {Player} from "../../../Player";
import {MoneyExchangeAction} from "./MoneyExchangeAction";

export class PropertyDevelopmentAction extends MoneyExchangeAction {

  public constructor(
    id: number,
    developer: Player,
    performedAt: Date,
    fromStage: PropertyDevelopmentStage,
    toStage: PropertyDevelopmentStage,
    developmentCost: number,
    property: Property
  ) {
    super(PropertyDevelopmentAction.name, id, developer, performedAt, null, developmentCost);
    this._fromStage = fromStage;
    this._toStage = toStage;
    this._property = property;
  }

  private _fromStage: PropertyDevelopmentStage;

  public get fromStage(): PropertyDevelopmentStage {
    return this._fromStage;
  }

  private _toStage: PropertyDevelopmentStage;

  public get toStage(): PropertyDevelopmentStage {
    return this._toStage;
  }

  private _property: Property;

  public get property(): Property {
    return this._property;
  }

  public static trueCopy(action: PropertyDevelopmentAction): PropertyDevelopmentAction | null {
    return new PropertyDevelopmentAction(
      action.id,
      Player.trueCopy(action.actor),
      new Date(action.performedAt),
      action.fromStage,
      action.toStage,
      action.amount,
      Property.trueCopy(action.property)
    );
  }

  public override toJson(): object {
    return Object.assign(
      super.toJson(), {
        "toStage": this.toStage,
        "fromStage": this.fromStage,
        "property": this.property.toJson(),
      }
    );
  }

  public override toString(): string {
    const fromStageDescription = Property.propertyDevelopmentStageDescriber(this.fromStage);
    const toStageDescription = Property.propertyDevelopmentStageDescriber(this.toStage);

    return `${this.actor.user.username} developed ${toStageDescription} ${this.property.toString()}.` +
      ` Previously it had: ${fromStageDescription}`;
  }

}
