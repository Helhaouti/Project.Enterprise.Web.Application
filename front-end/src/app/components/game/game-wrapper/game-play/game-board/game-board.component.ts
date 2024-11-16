import {Component} from '@angular/core';
import {
  GameStateManagerService,
  OwnableLocationStateTracker
} from "../../../../../services/game-state-manager/game-state-manager.service";
import {Player} from "../../../../../domain/models/game/Player";
import {Location} from "../../../../../domain/models/game/board/location/Location";
import {BoardCorner} from "../../../../../domain/models/game/board/location/locationImpl/BoardCorner";
import {GameActionService} from "../../../../../services/game/gameActionService";
import {GameActionUtil} from "../../../../../domain/models/game/action/GameActionUtil";
import {DrawCardAction} from "../../../../../domain/models/game/action/impl/card/DrawCardAction";
import {PickCardLocationPopUpComponent} from "../../../pick-card-location-pop-up/pick-card-location-pop-up.component";
import {SnackbarService} from "../../../../../services/snackbar/snackbar.service";
import {DialogService} from "../../../../../services/dialog/dialog.service";
import {CardType} from "../../../../../domain/models/game/card/Card";
import {OwnableLocation} from "../../../../../domain/models/game/board/location/OwnableLocation";

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent {
  readonly SCREEN_WIDTH_BREAKPOINT: number = 900;
  ownableLocationsStates: OwnableLocationStateTracker[] = [];
  canCurrentPlayerPickChestCard: boolean;
  players: Player[] = [];
  canCurrentPlayerPickChanceCard: boolean;

  constructor(
    private snackbar: SnackbarService,
    private dialogService: DialogService,
    public gameActionService: GameActionService,
    private gameStateManagerService: GameStateManagerService
  ) {
    this.gameStateManagerService.getGame().subscribe(game => this.players = game.players);

    this.gameStateManagerService.locationService
      .getStates().subscribe(states => this.ownableLocationsStates = states);

    this.gameStateManagerService.turnTrackerService
      .getTracker()
      .subscribe(trackedTurn => {
          const isTurnOfCurrentPlayer =
            this.gameStateManagerService.getCurrentPlayer().turnNumber === trackedTurn?.currentTurn;

          this.canCurrentPlayerPickChestCard = isTurnOfCurrentPlayer && trackedTurn?.canPickCard === CardType.CHEST;
          this.canCurrentPlayerPickChanceCard = isTurnOfCurrentPlayer && trackedTurn?.canPickCard === CardType.CHANCE;
        }
      );
  }

  public get locations(): Location[] {
    return this.gameStateManagerService
      .locationService
      .locations;
  }

  public get locationCornerGo(): Location {
    return this.gameStateManagerService
      .locationService
      .getLocationAt(BoardCorner.DEFAULT_GO_LOCATION);
  }

  public get locationCornerJail(): Location {
    return this.gameStateManagerService
      .locationService
      .getLocationAt(BoardCorner.DEFAULT_JAIL_LOCATION);
  }

  public get locationCornerFreeParking(): Location {
    return this.gameStateManagerService
      .locationService
      .getLocationAt(BoardCorner.DEFAULT_FREE_PARKING_LOCATION);
  }

  public get locationCornerGoToJail(): Location {
    return this.gameStateManagerService
      .locationService
      .getLocationAt(BoardCorner.DEFAULT_GO_TO_JAIL_LOCATION);
  }

  windowWidth: () => number = () => window.innerWidth;

  public getStateOf(location: Location): OwnableLocationStateTracker | undefined {
    if (!(location instanceof OwnableLocation)) return undefined;

    return this.ownableLocationsStates.find(state => state.location.id === location.id);
  }

  public getBottomRowLocations(): Location[] {
    return this.gameStateManagerService
      .locationService
      .locations
      .slice(1, 10)
      .reverse();
  }

  public getLeftRowLocations(): Location[] {
    return this.gameStateManagerService
      .locationService
      .locations
      .slice(11, 20)
      .reverse();
  }

  public getTopRowLocations(): Location[] {
    return this.gameStateManagerService
      .locationService
      .locations
      .slice(21, 30);
  }

  public getRightRowLocations(): Location[] {
    return this.gameStateManagerService
      .locationService
      .locations
      .slice(31, 40);
  }

  onDrawChestCard(): void {
    this.gameActionService.postDrawChestCard(
      this.gameStateManagerService.getGameSnapshot().id,
      action => this.reactToCardDraw(action),
      this.snackbar.displayErrorMessage
    );
  }

  onDrawChanceCard(): void {
    this.gameActionService.postDrawChanceCard(
      this.gameStateManagerService.getGameSnapshot().id,
      action => this.reactToCardDraw(action),
      this.snackbar.displayErrorMessage
    );
  }

  private reactToCardDraw(action: DrawCardAction) {
    const trueCopyOfAction: DrawCardAction = <DrawCardAction>GameActionUtil.trueCopy(action);
    const currentTurnTracker = this.gameStateManagerService.turnTrackerService.getTrackerSnapshot();

    this.gameStateManagerService.turnTrackerService
      .updateState(
        currentTurnTracker.currentTurn,
        currentTurnTracker.turnEndsAt,
        false,
        undefined
      );

    this.dialogService.openCardSizedDialogFrom(PickCardLocationPopUpComponent, trueCopyOfAction);
  }
}
