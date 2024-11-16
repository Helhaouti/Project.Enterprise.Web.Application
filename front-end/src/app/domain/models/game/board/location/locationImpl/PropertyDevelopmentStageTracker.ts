import {Property, PropertyDevelopmentStage} from "./Property";

export class PropertyDevelopmentStageTracker {
  public constructor(
    id: number,
    property: Property,
    developmentStage: PropertyDevelopmentStage
  ) {
    this._id = id;
    this._property = property;
    this._developmentStage = developmentStage;
  }

  private _id: number;

  get id(): number {
    return this._id;
  }

  private _property: Property;

  get property(): Property {
    return this._property;
  }

  private _developmentStage: PropertyDevelopmentStage;

  get developmentStage(): PropertyDevelopmentStage {
    return this._developmentStage;
  }

  set developmentStage(value: PropertyDevelopmentStage) {
    this._developmentStage = value;
  }

  public static trueCopy(tracker: PropertyDevelopmentStageTracker): PropertyDevelopmentStageTracker | null {
    return new PropertyDevelopmentStageTracker(
      tracker.id,
      Property.trueCopy(tracker.property),
      tracker.developmentStage,
    );
  }

  public toJson(): object {
    return {
      "id": this.id,
      "property": this.property,
      "developmentStage": this.developmentStage
    }
  }

}
