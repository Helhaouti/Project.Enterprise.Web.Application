import {BoardCorner} from "./locationImpl/BoardCorner";
import {PickCardLocation} from "./locationImpl/PickCardLocation";
import {Property} from "./locationImpl/Property";
import {TaxLocation} from "./locationImpl/TaxLocation";
import {Utility} from "./locationImpl/Utility";
import {Location} from "./Location";
import {RailRoad} from "./locationImpl/RailRoad";

export abstract class LocationUtil {
  private constructor() {
  }

  public static trueCopy(location: any): Location | null {
    switch (location.classType) {
      case BoardCorner.name:
        return BoardCorner.trueCopy(location);

      case PickCardLocation.name:
        return PickCardLocation.trueCopy(location);

      case Property.name:
        return Property.trueCopy(location);

      case TaxLocation.name:
        return TaxLocation.trueCopy(location);

      case Utility.name:
        return Utility.trueCopy(location);

      case RailRoad.name:
        return RailRoad.trueCopy(location);

      default:
        return null;
    }
  }

}
