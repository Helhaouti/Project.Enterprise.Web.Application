import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Player} from "../../../../../../domain/models/game/Player";
import {Location} from "../../../../../../domain/models/game/board/location/Location";
import {Property} from "../../../../../../domain/models/game/board/location/locationImpl/Property";
import {OwnableLocation} from "../../../../../../domain/models/game/board/location/OwnableLocation";
import {
  BoardCorner,
  BoardCornerType
} from "../../../../../../domain/models/game/board/location/locationImpl/BoardCorner";
import {LocationPopupComponent} from "../../location-popup/location-popup.component";
import {DialogService} from "../../../../../../services/dialog/dialog.service";
import {
  GameStateManagerService,
  OwnableLocationStateTracker
} from "../../../../../../services/game-state-manager/game-state-manager.service";
import {TaxLocation} from "../../../../../../domain/models/game/board/location/locationImpl/TaxLocation";
import {Utility} from "../../../../../../domain/models/game/board/location/locationImpl/Utility";
import {RailRoad} from "../../../../../../domain/models/game/board/location/locationImpl/RailRoad";

@Component({
  selector: 'board-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  @Input() public players: Player[] = [];
  @Input() public position: "bottom" | "left" | "top" | "right";
  @Input() public location: Location | undefined = undefined;
  @Input() public ownableLocationTracker: OwnableLocationStateTracker | undefined = undefined;
  @Output() public locationClick: EventEmitter<Location> = new EventEmitter<Location>();

  public constructor(
    private dialogService: DialogService,
    private gameStateManagerService: GameStateManagerService
  ) {
  }

  onClick() {
    this.dialogService.openCardSizedDialogFrom(
      LocationPopupComponent,
      this.location
    );
  }


  public isBoardCorner(): boolean {
    return this.location instanceof BoardCorner;
  }

  public isGo(): boolean {
    return !(!this.isBoardCorner()
      || (<BoardCorner>this.location).type !== BoardCornerType.GO);
  }

  public isJail(): boolean {
    return !(!this.isBoardCorner()
      || (<BoardCorner>this.location).type !== BoardCornerType.JAIL);
  }

  public isFreeParking(): boolean {
    return !(!this.isBoardCorner()
      || (<BoardCorner>this.location).type !== BoardCornerType.FREE_PARKING);
  }

  public isGoToJail(): boolean {
    return !(!this.isBoardCorner()
      || (<BoardCorner>this.location).type !== BoardCornerType.GO_TO_JAIL);
  }

  public getTaxAmount(): string | undefined {
    if (this.location instanceof TaxLocation) return `$${this.location.amount}`;
    return undefined;
  }

  public getPropertyColor(): string | undefined {
    if (this.location instanceof Property) return this.location.color;
    return undefined;
  }

  public isOwnableLocation(): boolean {
    return this.location instanceof OwnableLocation;
  }

  public determineRequiredRentOrPrice(): string {
    const NONE_MESSAGE: string = "None";

    if (!this.isOwnableLocation()) return NONE_MESSAGE;

    const currentState = this.ownableLocationTracker;
    const owner = this.gameStateManagerService.getGameSnapshot()
      .players
      .find(p => p.id === currentState?.currentOwnerPlayerId);

    if (owner == undefined) return `Price: $${(<OwnableLocation>this.location).initialPurchasePrice}`;

    if (this.location instanceof Utility) return "Rent: varied";

    if (this.location instanceof Property) {
      let currentOption = Property.DEVELOPMENT_LEVELS.find(o => o.key === currentState.propertyDevelopment.developmentStage)

      let rent = (<Property>this.location).rentWithNoHouse;
      switch (currentOption.level) {
        case 1:
          rent = (<Property>this.location).rentWithOneHouse;
          break;
        case 2:
          rent = (<Property>this.location).rentWithTwoHouses;
          break;
        case 3:
          rent = (<Property>this.location).rentWithThreeHouses;
          break;
        case 4:
          rent = (<Property>this.location).rentWithFourHouses;
          break;
        case 5:
          rent = (<Property>this.location).rentWithHotel;
          break;
      }

      return `Rent: $${rent}`;
    }

    if (this.location instanceof RailRoad) {
      let amountOfRailroadsOwned = owner.properties.filter(p => p instanceof RailRoad).length;

      let rent = (<RailRoad>this.location).rent;
      switch (amountOfRailroadsOwned) {
        case 2:
          rent = (<RailRoad>this.location).rentIfTwoAreOwned;
          break;
        case 3:
          rent = (<RailRoad>this.location).rentIfThreeOwned;
          break;
        case 4:
          rent = (<RailRoad>this.location).rentIfFourAreOwned;
          break;
      }

      return `Rent: $${rent}`;
    }

    return NONE_MESSAGE;
  }
}
