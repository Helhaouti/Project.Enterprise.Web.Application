import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  Property,
  PropertyDevelopmentStage
} from "../../../../../domain/models/game/board/location/locationImpl/Property";
import {OwnableLocation, OwnableLocationState} from "../../../../../domain/models/game/board/location/OwnableLocation";
import {Location} from "../../../../../domain/models/game/board/location/Location";
import {RailRoad} from "../../../../../domain/models/game/board/location/locationImpl/RailRoad";
import {Utility} from "../../../../../domain/models/game/board/location/locationImpl/Utility";
import {BoardCorner, BoardCornerType} from "../../../../../domain/models/game/board/location/locationImpl/BoardCorner";
import {GameStateManagerService} from "../../../../../services/game-state-manager/game-state-manager.service";
import {GameActionService} from "../../../../../services/game/gameActionService";
import {SnackbarService} from "../../../../../services/snackbar/snackbar.service";
import {Player} from "../../../../../domain/models/game/Player";

@Component({
  selector: 'app-location-popup',
  templateUrl: './location-popup.component.html',
  styleUrls: ['./location-popup.component.scss']
})
export class LocationPopupComponent implements OnInit {
  public availablePropertyDevelopmentOptions: { key: string, value: string }[] = [];

  constructor(
    public snackbar: SnackbarService,
    public gameActionService: GameActionService,
    public gameStateManagerService: GameStateManagerService,
    private dialogRef: MatDialogRef<LocationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public location: Location,
  ) {
    if (this.isDevelopmentPossible())
      this.availablePropertyDevelopmentOptions = this.availableDevelopmentOptionsOfProperty();
  }

  ngOnInit(): void {
  }

  public getPropertyColor(): string | undefined {
    if (this.location instanceof Property) return this.location.color;
    return undefined;
  }

  public isOwnableLocation(): boolean {
    return this.location instanceof OwnableLocation;
  }

  public getInitialPurchasePrice(): string | undefined {
    if (this.isOwnableLocation()) return `$${(<OwnableLocation>this.location).initialPurchasePrice}`;
    return undefined;
  }

  public getProperty(): Property | undefined {
    if (this.location instanceof Property) return this.location;
    return undefined;
  }

  public getRailRoad(): RailRoad | undefined {
    if (this.location instanceof RailRoad) return this.location;
    return undefined;
  }

  public getUtility(): Utility | undefined {
    if (this.location instanceof Utility) return this.location;
    return undefined;
  }

  public isJail(): boolean {
    return this.location instanceof BoardCorner
      && this.location.type === BoardCornerType.JAIL;
  }

  public getCurrentOwner(): Player | undefined {
    if (!(this.location instanceof OwnableLocation)) return undefined;

    const currentState = this.gameStateManagerService.locationService.getStateOf(this.location.id);

    if (currentState.state === OwnableLocationState.AVAILABLE) return undefined;

    return this.gameStateManagerService.getGameSnapshot()
      .players
      .filter(p => p.id === currentState.currentOwnerPlayerId)
      .pop();
  }

  public isBuyable(): boolean {
    // Check if property can be owned.
    return this.isOwnableLocation()

      // Check if the property is up for sale.
      && this.gameStateManagerService.locationService
        .getStateOf(this.location.id).state === OwnableLocationState.AVAILABLE

      // Check if the current player is standing on it.
      && this.gameStateManagerService.getCurrentPlayer()
        .position === this.location.position

      // Check if the player has enough money.
      && this.gameStateManagerService.getCurrentPlayer()
        .money >= (<OwnableLocation>this.location).initialPurchasePrice
  }

  public onBuyCurrentLocation(): void {
    this.gameActionService.postBuyLocation(
      this.gameStateManagerService.getGameSnapshot().id,
      this.location.id,
      () => {
        this.snackbar.openSuccesSnackbar({
          message: "You have successfully purchased this location.",
          action: undefined
        });

        this.onClose();
      },
      this.snackbar.displayErrorMessage
    );
  }

  public onDevelopProperty(toStage: string): void {
    this.gameActionService.postDevelopLocation(
      this.gameStateManagerService.getGameSnapshot().id,
      this.location.id,
      PropertyDevelopmentStage[toStage],
      () => {
        this.snackbar.openSuccesSnackbar({
          message: "You have successfully developed your property.",
          action: undefined
        });

        this.onClose();
      },
      this.snackbar.displayErrorMessage
    );
  }

  public isDevelopmentPossible(): boolean {
    if (!(this.location instanceof Property)) return false;

    const currentState = this.gameStateManagerService.locationService.getStateOf(this.location.id);

    return currentState.currentOwnerPlayerId === this.gameStateManagerService.getCurrentPlayer().id;
  }

  public availableDevelopmentOptionsOfProperty(): { key: string, value: string }[] {
    if (!(this.location instanceof Property)) return [];

    const currentState = this.gameStateManagerService.locationService.getStateOf(this.location.id);

    if (currentState.currentOwnerPlayerId !== this.gameStateManagerService.getCurrentPlayer().id) return []

    let currentOption = Property.DEVELOPMENT_LEVELS.find(o => o.key === currentState.propertyDevelopment.developmentStage)

    return currentOption ? Property.DEVELOPMENT_LEVELS.filter(o => o.level > currentOption.level) : [];
  }

  public determineRequiredRent(): string {
    const NONE_MESSAGE: string = "None";

    if (!this.isOwnableLocation()) return NONE_MESSAGE;

    const currentState = this.gameStateManagerService.locationService.getStateOf(this.location.id);
    const owner = this.gameStateManagerService.getGameSnapshot()
      .players
      .find(p => p.id === currentState?.currentOwnerPlayerId);

    if (owner == undefined) return NONE_MESSAGE;

    if (this.location instanceof Utility) return "Depends on dice-roll and amount owned.";

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

      return `$${rent}`;
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

      return `$${rent}`;
    }

    return NONE_MESSAGE;
  }

  onClose() {
    this.dialogRef.close();
  }

}
