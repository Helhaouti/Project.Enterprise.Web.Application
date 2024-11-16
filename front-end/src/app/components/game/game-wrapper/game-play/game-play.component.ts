import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameActionService} from "../../../../services/game/gameActionService";
import {GameAction} from "../../../../domain/models/game/action/GameAction";
import {SnackbarService} from "../../../../services/snackbar/snackbar.service";
import {DrawCardAction} from "../../../../domain/models/game/action/impl/card/DrawCardAction";
import {DeclareBankruptcyAction} from "../../../../domain/models/game/action/impl/gamePlay/DeclareBankruptcyAction";
import {DiceRollAction} from "../../../../domain/models/game/action/impl/gamePlay/DiceRollAction";
import {PlayerMoveAction} from "../../../../domain/models/game/action/impl/gamePlay/PlayerMoveAction";
import {StartGameAction} from "../../../../domain/models/game/action/impl/gamePlay/StartGameAction";
import {SwitchPlayerAction} from "../../../../domain/models/game/action/impl/gamePlay/SwitchPlayerAction";
import {WinGameAction} from "../../../../domain/models/game/action/impl/gamePlay/WinGameAction";
import {FreeFromJailAction} from "../../../../domain/models/game/action/impl/jail/FreeFromJailAction";
import {GoToJailAction} from "../../../../domain/models/game/action/impl/jail/GoToJailAction";
import {PayTaxAction} from "../../../../domain/models/game/action/impl/money/PayTaxAction";
import {ReceiveFreeMoneyAction} from "../../../../domain/models/game/action/impl/money/ReceiveFreeMoneyAction";
import {RentCollectionAction} from "../../../../domain/models/game/action/impl/money/RentCollectionAction";
import {GameSession, GameSessionState} from "../../../../domain/models/game/GameSession";
import {LocationPurchaseAction} from "../../../../domain/models/game/action/impl/property/LocationPurchaseAction";
import {PropertyDevelopmentAction} from "../../../../domain/models/game/action/impl/money/PropertyDevelopmentAction";
import {MatBottomSheet, MatBottomSheetConfig} from "@angular/material/bottom-sheet";
import {DiceComponent} from "../../dice/dice.component";
import {GameRepository} from "../../../../repositories/game.repository";
import {AuthService} from "../../../../services/authentication/auth.service";
import {GameStateManagerService} from "../../../../services/game-state-manager/game-state-manager.service";
import {DialogService} from "../../../../services/dialog/dialog.service";
import {Player} from "../../../../domain/models/game/Player";
import {PickCardLocationPopUpComponent} from "../../pick-card-location-pop-up/pick-card-location-pop-up.component";
import {PassGoAction} from "../../../../domain/models/game/action/impl/gamePlay/PassGoAction";
import {SkipTurnTaxAction} from "../../../../domain/models/game/action/impl/money/SkipTurnTaxAction";
import {DebtForeclosureAction} from "../../../../domain/models/game/action/impl/money/DebtForeclosureAction";
import {GameActionUtil} from "../../../../domain/models/game/action/GameActionUtil";

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnDestroy {
  private gameJustStarted: boolean = true;

  public gameSession!: GameSession;
  public gameActionRefreshInterval = 0;
  private timedFunctionId: ReturnType<typeof setInterval>;

  public gameStarted: boolean;

  public currentPlayerAbleToRollDice: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private snackbar: SnackbarService,
    private gameRepo: GameRepository,
    private gameActionService: GameActionService,
    private authService: AuthService,
    private gameStateManagerService: GameStateManagerService,
    private dialogService: DialogService,
  ) {
    this.route.parent.params.subscribe(params => {
      let id: number = parseInt(params["id"]);

      if (isNaN(id)) this.navigateToGameOverview();

      else {
        this.gameRepo.getBy(
          id,
          gameSession => {
            this.gameSession = gameSession;
            this.gameSession.actions = [];

            this.validateGameState();
            this.init();
          },
          () => {
            this.snackbar.openWarningSnackbar(
              {message: "The game could not be retrieved.", action: undefined}
            );
            this.onBack();
          }
        );

        this.incrementSpinner();
      }
    });

  }

  ngOnDestroy(): void {
    window.clearInterval(this.timedFunctionId);
    this.gameActionService.terminate();
    this.gameStateManagerService.terminate();
  }

  onDiceRoll(): void {
    this.gameActionService.postDiceRoll(this.gameStateManagerService.getGameSnapshot().id)
      .subscribe(
        action => {
          const trueCopyOfAction: DiceRollAction = <DiceRollAction>GameActionUtil.trueCopy(action);
          const currentTurnTracker = this.gameStateManagerService.turnTrackerService.getTrackerSnapshot();

          this.gameStateManagerService.turnTrackerService
            .updateState(
              currentTurnTracker.currentTurn,
              currentTurnTracker.turnEndsAt,
              false,
              undefined
            );

          this.bottomSheet.open(DiceComponent, <MatBottomSheetConfig>{data: trueCopyOfAction});
        },
        this.snackbar.displayErrorMessage
      );
  }

  playerIsCreator() {
    return this.gameStateManagerService.getCurrentPlayer().gameAdmin;
  }

  onBack() {
    this.router.navigate(["../../game"]);
  }

  private validateGameState(): void {
    const currentPlayer: Player | undefined =
      this.gameSession.players.find(player => player.user.id == this.authService.getCurrentUserSnapshot()?.id)

    if (currentPlayer == undefined) {
      this.snackbar.openWarningSnackbar(
        {message: "You have not joined this game. Join to play.", action: undefined}
      );
      this.onBack();
    } else if (this.gameSession.state == GameSessionState.JOINABLE) {
      this.snackbar.openSuccesSnackbar(
        {message: "The game has not yet started. Wait until there are enough members.", action: undefined});
      this.router.navigate(["lobby"], {relativeTo: this.route.parent});

    } else if (this.gameSession.state == GameSessionState.COMPLETED) {
      this.snackbar.openWarningSnackbar({message: "The game can no longer be played.", action: undefined});
      this.router.navigate(["info"], {relativeTo: this.route.parent});
    }
  }

  incrementSpinner(): void {
    let increment = GameActionService.ACTION_REFRESH_INTERVAL / 10;

    this.timedFunctionId = setInterval(
      () => this.gameActionRefreshInterval += increment / (GameActionService.ACTION_REFRESH_INTERVAL / 100),
      increment);
  }

  onLoadGameActions(): void {
    this.gameActionService.refreshActions(() => this.gameActionRefreshInterval = 0);
  }

  private init(): void {
    this.gameStateManagerService
      .init(this.gameSession)
      .subscribe(session => this.gameSession = session);

    this.gameStateManagerService.turnTrackerService
      .getTracker()
      .subscribe(
        trackedTurn => {
          let turnOfCurrentPlayer =
            this.gameStateManagerService.getCurrentPlayer().turnNumber === trackedTurn?.currentTurn;

          this.currentPlayerAbleToRollDice = turnOfCurrentPlayer && trackedTurn?.canRollDice;
        }
      );

    this.gameActionService
      .start(
        this.gameSession.id,
        actions => {
          this.gameActionRefreshInterval = 0;

          actions.forEach(action => {
            this.procesNewGameAction(action);
            this.gameSession.actions.push(action);
          });

          this.gameJustStarted = false;
        }
      )
      .subscribe(
        actions => {
          this.gameActionRefreshInterval = 0;

          actions.forEach(action => {
            this.procesNewGameAction(action);
            this.gameSession.actions.push(action);
          });

        },
        this.snackbar.displayErrorMessage
      );

    this.gameStarted = true;
  }

  private procesNewGameAction(action: GameAction): void {
    switch (action.classType) {
      case StartGameAction.name:
        this.gameStateManagerService.startGame(<StartGameAction>action);
        break;

      case DrawCardAction.name:
        if (this.gameJustStarted || this.gameStateManagerService.getCurrentPlayer().id === action.actor.id) return;

        this.dialogService.openCardSizedDialogFrom(PickCardLocationPopUpComponent, <DrawCardAction>action);
        break;

      case PassGoAction.name:
        this.gameStateManagerService.procesPassGoAction(<PassGoAction>action, false);
        break;

      case DebtForeclosureAction.name:
        this.gameStateManagerService.procesDebtForeclosureAction(<DebtForeclosureAction>action, false);
        break;

      case SkipTurnTaxAction.name:
        this.gameStateManagerService.procesSkipTurnTaxAction(<SkipTurnTaxAction>action, false);
        break;

      case DeclareBankruptcyAction.name:
        this.gameStateManagerService.procesDeclareBankruptcyAction(<DeclareBankruptcyAction>action, false);
        break;

      case DiceRollAction.name:
        this.gameStateManagerService.procesDiceRollAction(<DiceRollAction>action, false);

        if (this.gameJustStarted || this.gameStateManagerService.getCurrentPlayer().id === action.actor.id) return;

        this.bottomSheet
          .open(
            DiceComponent,
            <MatBottomSheetConfig>{data: <DiceRollAction>action}
          );
        break;

      case PlayerMoveAction.name:
        this.gameStateManagerService.procesMoveTokenAction(<PlayerMoveAction>action, false);
        break;

      case SwitchPlayerAction.name:
        this.gameStateManagerService
          .procesSwitchPlayerAction(<SwitchPlayerAction>action, false);

        if (!this.gameJustStarted)
          this.snackbar.openSuccesSnackbar({
            message: `It is now the turn of ${(<SwitchPlayerAction>action).newPlayer.user.username}`,
            action: undefined
          });

        break;

      case WinGameAction.name:
        this.router.navigate(["info"], {relativeTo: this.route.parent})
        break;

      case FreeFromJailAction.name:
        this.gameStateManagerService.procesFreeFromJailAction(<FreeFromJailAction>action, false);
        break;

      case GoToJailAction.name:
        this.gameStateManagerService.procesGoToJailAction(<GoToJailAction>action, false);
        break;

      case PayTaxAction.name:
        this.gameStateManagerService.procesPayTaxAction(<PayTaxAction>action, false);
        break;

      case ReceiveFreeMoneyAction.name:
        this.gameStateManagerService.procesReceiveFreeMoneyAction(<ReceiveFreeMoneyAction>action, false);
        break;

      case RentCollectionAction.name:
        this.gameStateManagerService.procesRentCollectionAction(<RentCollectionAction>action, false)
        break;

      case LocationPurchaseAction.name:
        this.gameStateManagerService.procesLocationPurchaseAction(<LocationPurchaseAction>action, false)
        break;

      case PropertyDevelopmentAction.name:
        this.gameStateManagerService.procesPropertyDevelopmentAction(<PropertyDevelopmentAction>action, false)
        break;

      default:
        return null;
    }
  }

  onGameLeave() {
    if (!confirm("Are you sure you want to leave the game? You will be declared bankrupt.")) return;

    const currentPlayerId = this.gameSession.players.find(player =>
      player.user.id == this.authService.getCurrentUserSnapshot()?.id)?.id

    this.gameRepo.leaveGame(
      currentPlayerId,
      this.gameSession.id,
      () => this.onBack(),
      this.snackbar.displayErrorMessage
    );

  }

  navigateToGameOverview(): void {
    this.router.navigate(["/game"]);
  }
}
