import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Player} from "../../domain/models/game/Player";
import {PlayerMoveAction} from "../../domain/models/game/action/impl/gamePlay/PlayerMoveAction";
import {ReceiveFreeMoneyAction} from "../../domain/models/game/action/impl/money/ReceiveFreeMoneyAction";
import {PayTaxAction} from "../../domain/models/game/action/impl/money/PayTaxAction";
import {GoToJailAction} from "../../domain/models/game/action/impl/jail/GoToJailAction";
import {StartGameAction} from "../../domain/models/game/action/impl/gamePlay/StartGameAction";
import {DeclareBankruptcyAction} from "../../domain/models/game/action/impl/gamePlay/DeclareBankruptcyAction";
import {GameSession} from "../../domain/models/game/GameSession";
import {User} from "../../domain/models/user.model";
import {AuthService} from "../authentication/auth.service";
import {MoneyExchangeAction} from "../../domain/models/game/action/impl/money/MoneyExchangeAction";
import {DebtForeclosureAction} from "../../domain/models/game/action/impl/money/DebtForeclosureAction";
import {PropertyDevelopmentAction} from "../../domain/models/game/action/impl/money/PropertyDevelopmentAction";
import {Property, PropertyDevelopmentStage} from "../../domain/models/game/board/location/locationImpl/Property";
import {RentCollectionAction} from "../../domain/models/game/action/impl/money/RentCollectionAction";
import {SkipTurnTaxAction} from "../../domain/models/game/action/impl/money/SkipTurnTaxAction";
import {LocationPurchaseAction} from "../../domain/models/game/action/impl/property/LocationPurchaseAction";
import {PassGoAction} from "../../domain/models/game/action/impl/gamePlay/PassGoAction";
import {SwitchPlayerAction} from "../../domain/models/game/action/impl/gamePlay/SwitchPlayerAction";
import {FreeFromJailAction} from "../../domain/models/game/action/impl/jail/FreeFromJailAction";
import {CardType} from "../../domain/models/game/card/Card";
import {DiceRollAction} from "../../domain/models/game/action/impl/gamePlay/DiceRollAction";
import {PickCardLocation} from "../../domain/models/game/board/location/locationImpl/PickCardLocation";
import {GameBoard} from "../../domain/models/game/board/GameBoard";
import {Location} from "../../domain/models/game/board/location/Location";
import {OwnableLocation, OwnableLocationState} from "../../domain/models/game/board/location/OwnableLocation";
import {
  PropertyDevelopmentStageTracker
} from "../../domain/models/game/board/location/locationImpl/PropertyDevelopmentStageTracker";

export class GameTurnTracker {
  constructor(
    currentTurn: number,
    turnEndsAt: Date,
    canRollDice: boolean,
    canPickCard: CardType | undefined
  ) {
    this._currentTurn = currentTurn;
    this._turnEndsAt = turnEndsAt;
    this._canRollDice = canRollDice;
    this._canPickCard = canPickCard;
  }

  private _currentTurn: number;

  get currentTurn(): number {
    return this._currentTurn;
  }

  private _turnEndsAt: Date;

  get turnEndsAt(): Date {
    return this._turnEndsAt;
  }

  private _canRollDice: boolean;

  get canRollDice(): boolean {
    return this._canRollDice;
  }

  private _canPickCard: CardType | undefined;

  get canPickCard(): CardType | undefined {
    return this._canPickCard;
  }
}

export class OwnableLocationStateTracker {
  public constructor(
    location: OwnableLocation,
    propertyDevelopment?: PropertyDevelopmentStageTracker
  ) {
    this._location = location;
    this._state = OwnableLocationState.AVAILABLE;
    this._propertyDevelopment = propertyDevelopment;
    this._currentOwnerPlayerId = undefined;
  }

  private _location: OwnableLocation;

  public get location(): Location {
    return this._location;
  }

  private _state: OwnableLocationState;

  public get state(): OwnableLocationState {
    return this._state;
  }

  private _currentOwnerPlayerId: number | undefined;

  public get currentOwnerPlayerId(): number | undefined {
    return this._currentOwnerPlayerId;
  }

  public set currentOwnerPlayerId(id: number | undefined) {
    if (id == undefined) {
      this._state = OwnableLocationState.AVAILABLE;
      this._currentOwnerPlayerId = undefined;

      return;
    }

    this._currentOwnerPlayerId = id;
    this._state = OwnableLocationState.PURCHASED;
  }

  private _propertyDevelopment: PropertyDevelopmentStageTracker;

  public get propertyDevelopment(): PropertyDevelopmentStageTracker {
    return this._propertyDevelopment;
  }

  public set propertyDevelopment(value: PropertyDevelopmentStageTracker) {
    this._propertyDevelopment = value;
  }

}

class TurnTrackerService {
  private tracker: BehaviorSubject<GameTurnTracker | undefined> | undefined = undefined;

  public constructor() {
  }

  public getTracker(): Observable<GameTurnTracker> {
    return this.tracker.asObservable();
  }

  public getTrackerSnapshot(): GameTurnTracker {
    return this.tracker.getValue();
  }

  public init(): Observable<GameTurnTracker> {
    this.terminate();

    this.tracker = new BehaviorSubject<GameTurnTracker | undefined>(undefined);

    return this.getTracker();
  }

  public updateState(
    newTurn: number,
    endsAt: Date,
    canRollDice: boolean,
    canPickCard: CardType | undefined
  ): void {
    if (this.tracker == undefined) return;

    this.tracker.next(new GameTurnTracker(newTurn, endsAt, canRollDice, canPickCard));
  }

  public terminate(): void {
    this.tracker?.complete();
  }
}

class LocationService {
  private _board: GameBoard;
  private _stateTrackerSubject: BehaviorSubject<OwnableLocationStateTracker[]> | undefined = undefined;

  public constructor() {
  }

  public get locations(): Location[] {
    return this._board.locations.sort((a, b) => a.position - b.position);
  }

  public init(game: GameSession) {
    this.terminate();

    this._stateTrackerSubject = new BehaviorSubject<OwnableLocationStateTracker[]>([]);

    this._board = game.gameBoard;

    const trackedLocationStates = this._board.locations
      .filter(location => location instanceof OwnableLocation)
      .map(location => {
        let trackedPropertyDevelopment = undefined;

        if (location instanceof Property)
          trackedPropertyDevelopment = game.propertyDevelopments.find(dev => dev.property.id === location.id);

        return new OwnableLocationStateTracker(
          <OwnableLocation>location,
          trackedPropertyDevelopment
        );
      });

    this._stateTrackerSubject.next(trackedLocationStates);
  }

  public terminate(): void {
    this._stateTrackerSubject?.complete();
  }

  public updateOwnerOf(
    ownableLocationId: number,
    newOwnerPlayerId: number
  ) {
    const currentStateIndex = this.getIndexOfStateOf(ownableLocationId);
    if (currentStateIndex === -1) return undefined;

    const currentStates = this.getStatesSnapshot();

    currentStates[currentStateIndex].currentOwnerPlayerId = newOwnerPlayerId;

    this._stateTrackerSubject.next(currentStates);
  }

  public updatePropertyDevelopmentLevelOf(
    propertyId: number,
    developmentStage: PropertyDevelopmentStage
  ) {
    const currentStateIndex = this.getIndexOfStateOf(propertyId);
    if (currentStateIndex === -1) return undefined;

    const currentStates = this.getStatesSnapshot();

    currentStates[currentStateIndex].propertyDevelopment.developmentStage = developmentStage;

    this._stateTrackerSubject.next(currentStates);
  }

  public getLocationAt(position: number): Location | undefined {
    return this.locations.find(location => location.position === position);
  }

  public getStates(): Observable<OwnableLocationStateTracker[]> {
    return this._stateTrackerSubject.asObservable();
  }

  public getStatesSnapshot(): OwnableLocationStateTracker[] {
    return this._stateTrackerSubject.getValue();
  }

  public getIndexOfStateOf(locationId: number): number {
    return this._stateTrackerSubject.getValue().findIndex(location => location.location.id === locationId);
  }

  public getStateOf(locationId: number): OwnableLocationStateTracker {
    let stateIndex = this.getIndexOfStateOf(locationId);

    if (stateIndex === -1) return undefined;

    return this._stateTrackerSubject.getValue()[stateIndex];
  }

}

@Injectable({
  providedIn: 'root'
})
export class GameStateManagerService implements OnDestroy {
  private static readonly ITEM_NOT_FOUND: number = -1;

  private gameSubject: BehaviorSubject<GameSession> | undefined = undefined;
  private currentUser: User | null = null;

  private readonly _turnTrackerService;
  private readonly _locationService;

  private constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUserSnapshot();
    this._turnTrackerService = new TurnTrackerService();
    this._locationService = new LocationService();
  }

  get turnTrackerService(): TurnTrackerService {
    return this._turnTrackerService;
  }

  get locationService(): LocationService {
    return this._locationService;
  }

  ngOnDestroy(): void {
    this.terminate();
  }

  public init(game: GameSession): Observable<GameSession | undefined> {
    this.terminate();

    const gameTrueCopy: GameSession = GameSession.trueCopy(game);

    this.gameSubject = new BehaviorSubject<GameSession>(gameTrueCopy);
    this.locationService.init(gameTrueCopy);
    this.turnTrackerService.init();

    return this.getGame();
  }

  public startGame(action: StartGameAction): void {
    const FIRST_TURN_NUMBER: number = 1;
    const game: GameSession = this.getGameSnapshot();

    game.players.forEach(player => {
        // Give all user default values when the game starts.
        player.money = action.startCapital;
        player.position = 1;
        player.cards = [];
        player.properties = [];
        player.bankrupt = false;
        player.roundsInJail = 0;
      }
    );

    game.propertyDevelopments.forEach(development =>
      development.developmentStage = PropertyDevelopmentStage.NO_DEVELOPMENT);

    game.currentTurn = FIRST_TURN_NUMBER;
    this.turnTrackerService.updateState(
      FIRST_TURN_NUMBER,
      action.firstTurnEndsAt,
      true,
      undefined
    );

    this.gameSubject.next(game);
  }

  public procesSwitchPlayerAction(action: SwitchPlayerAction, undo: boolean): void {
    const newTurnNumber: number = undo ? action.actor.turnNumber : action.newPlayer.turnNumber;
    const game = this.getGameSnapshot();

    const playerThatSwitchesTurnIndex: number = game
      .players
      .findIndex(player => player.id === action.actor.id);

    if (game.players[playerThatSwitchesTurnIndex].roundsInJail > 0)
      game.players[playerThatSwitchesTurnIndex].roundsInJail++

    game.currentTurn = newTurnNumber;

    this.turnTrackerService
      .updateState(
        newTurnNumber,
        action.turnEndsAt,
        true,
        undefined
      );

    this.gameSubject.next(game);
  }

  public procesDiceRollAction(action: DiceRollAction, undo: boolean): void {
    if (action.actor.id === this.getCurrentPlayer().id) return;

    const currentTurnTracker: GameTurnTracker = this.turnTrackerService.getTrackerSnapshot();

    this.turnTrackerService
      .updateState(
        currentTurnTracker.currentTurn,
        currentTurnTracker.turnEndsAt,
        undo,
        undefined
      );
  }

  public procesMoveTokenAction(action: PlayerMoveAction, undo: boolean): void {
    const game = this.getGameSnapshot();
    const playerToMoveIndex: number = game
      .players
      .findIndex(player => player.id === action.actor.id);

    const destinationPosition: number = undo ? action.fromPosition : action.toPosition;

    game
      .players[playerToMoveIndex]
      .position = destinationPosition;

    const destinationLocation = game
      .gameBoard
      .locations
      .filter(location => location.position === destinationPosition)
      .pop();

    if (destinationLocation instanceof PickCardLocation) {
      const pickCardLocation = <PickCardLocation>destinationLocation;
      const currentTurnTracker: GameTurnTracker = this.turnTrackerService.getTrackerSnapshot();

      this.turnTrackerService.updateState(
        game.currentTurn,
        currentTurnTracker.turnEndsAt,
        false,
        pickCardLocation.type
      )
    }

    this.gameSubject.next(game);
  }

  public procesGoToJailAction(action: GoToJailAction, undo: boolean): void {
    const game = this.getGameSnapshot();
    const playerToJailIndex: number = game.players.findIndex(player => player.id === action.actor.id);

    game
      .players[playerToJailIndex]
      .roundsInJail = undo ? 0 : 1;

    this.gameSubject.next(game);
  }

  public procesFreeFromJailAction(action: FreeFromJailAction, undo: boolean): void {
    const game = this.getGameSnapshot();
    const playerToJailIndex: number = game.players.findIndex(player => player.id === action.actor.id);

    game
      .players[playerToJailIndex]
      .roundsInJail = undo ? 1 : 0;

    this.gameSubject.next(game);
  }

  public procesReceiveFreeMoneyAction(action: ReceiveFreeMoneyAction, undo: boolean): void {
    this.procesTransferMoneyAction(action, undo);
  }

  public procesRentCollectionAction(action: RentCollectionAction, undo: boolean): void {
    this.procesTransferMoneyAction(action, undo);
  }

  public procesPassGoAction(action: PassGoAction, undo: boolean): void {
    this.procesTransferMoneyAction(action, undo);
  }

  public procesSkipTurnTaxAction(action: SkipTurnTaxAction, undo: boolean): void {
    this.procesTransferMoneyAction(action, undo);
  }

  public procesPayTaxAction(action: PayTaxAction, undo: boolean): void {
    this.procesTransferMoneyAction(action, undo);
  }

  public procesDebtForeclosureAction(action: DebtForeclosureAction, undo: boolean): void {
    this.procesTransferMoneyAction(action, undo);
  }

  public procesPropertyDevelopmentAction(action: PropertyDevelopmentAction, undo: boolean): void {
    this.procesTransferMoneyAction(action, undo);

    this.locationService
      .updatePropertyDevelopmentLevelOf(
        action.property.id,
        undo ? action.fromStage : action.toStage
      );
  }

  public procesLocationPurchaseAction(action: LocationPurchaseAction, undo: boolean): void {
    const game = this.getGameSnapshot();

    this.procesTransferMoneyAction(action, undo);

    this.locationService.updateOwnerOf(
      action.asset.id,
      undo ? action.recipient.id : action.actor.id
    );

    if (action.actor != null) {
      const buyerIndex: number = game.players.findIndex(player => player.id === action.actor.id);

      undo
        ? game.players[buyerIndex].properties.pop()
        : game.players[buyerIndex].properties.push(action.asset);
    }

    if (action.recipient != null) {
      const previousOwnerIndex: number = game.players.findIndex(player => player.id === action.recipient.id);

      undo
        ? game.players[previousOwnerIndex].properties.push(action.asset)
        : game.players[previousOwnerIndex].properties.pop();
    }

    this.gameSubject.next(game);
  }

  public procesDeclareBankruptcyAction(action: DeclareBankruptcyAction, undo: boolean) {
    const game = this.getGameSnapshot();

    const playerToBankruptIndex: number = game.players.findIndex(player => player.id === action.actor.id);
    if (playerToBankruptIndex === GameStateManagerService.ITEM_NOT_FOUND) return;

    for (let toBeRemovedLocation of action.removedOwnedLocations)
      this.locationService.updateOwnerOf(
        toBeRemovedLocation.id,
        undo ? undefined : action.actor.id
      );

    game.players[playerToBankruptIndex].bankrupt = !undo;
    game.players[playerToBankruptIndex].money = undo ? action.removedMoney : 0;
    game.players[playerToBankruptIndex].properties = undo ? action.removedOwnedLocations : [];
    game.players[playerToBankruptIndex].cards = undo ? action.removedOwnedJailBreakCard : [];

    this.gameSubject.next(game);
  }

  getPlayersAt(position: number): Player[] {
    return this.getGameSnapshot().players.filter(player => player.position === position);
  }

  getPlayersInJail(): Player[] {
    return this.getGameSnapshot().players.filter(player => player.roundsInJail > 0);
  }

  public terminate(): void {
    this.gameSubject?.complete();
    this.turnTrackerService.terminate();
  }

  public getGame(): Observable<GameSession> {
    return this.gameSubject.asObservable();
  }

  public getGameSnapshot(): GameSession {
    return this.gameSubject.value;
  }

  public getCurrentPlayer(): Player {
    return this.getGameSnapshot().players.find(player => player.user.id === this.currentUser.id);
  }

  public getNumberOfLocationsOwnedOfSameType(playerId: number, location: Location): number {
    return this.getGameSnapshot()
      .players
      .find(player => player.id === playerId)
      .properties
      .filter(loc => loc.constructor.name === location.constructor.name)
      .length;
  }

  private procesTransferMoneyAction(action: MoneyExchangeAction, undo: boolean): void {
    const game = this.getGameSnapshot();

    if (action.actor != null) {
      const payeeIndex: number = game.players.findIndex(player => player.id === action.actor.id);
      const payee: Player = game.players[payeeIndex];

      payee.money = undo ? payee.money + action.amount : payee.money - action.amount;
    }

    if (action.recipient != null) {
      const recipientIndex: number = game.players.findIndex(player => player.id === action.recipient.id);
      const recipient: Player = game.players[recipientIndex];

      recipient.money = undo ? recipient.money - action.amount : recipient.money + action.amount;
    }

    this.gameSubject.next(game);
  }

}
