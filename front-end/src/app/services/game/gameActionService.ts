import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {GameAction} from "../../domain/models/game/action/GameAction";
import {GameActionUtil} from "../../domain/models/game/action/GameActionUtil";
import {DiceRollAction} from "../../domain/models/game/action/impl/gamePlay/DiceRollAction";
import {DrawCardAction} from "../../domain/models/game/action/impl/card/DrawCardAction";
import {PropertyDevelopmentStage} from "../../domain/models/game/board/location/locationImpl/Property";

@Injectable({
  providedIn: 'root'
})
export class GameActionService implements OnDestroy {
  public static readonly API_ROUTE: (gameId: number) => string =
    (gameId: number) => `${environment.apiUrl}/game/${gameId}/action`;
  public static ACTION_REFRESH_INTERVAL: number = 10000;

  private allActionSubject: BehaviorSubject<GameAction[]> = new BehaviorSubject<GameAction[]>([]);
  private newActionSubject: BehaviorSubject<GameAction[]> = new BehaviorSubject<GameAction[]>([]);
  private intervalFunctionId: ReturnType<typeof setInterval>;

  private gameId: number | undefined;

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnDestroy(): void {
    this.terminate();
  }

  public terminate(): void {
    window.clearInterval(this.intervalFunctionId);
    this.allActionSubject.complete();
    this.newActionSubject.complete();
  }

  public getGameId(): number {
    return this.gameId || 0;
  }

  public start(
    id: number,
    onSucces: (actions: GameAction[]) => void
  ): Observable<GameAction[]> {
    // Stop previous work, if any.
    this.terminate();

    // Initialize service for new game.
    this.allActionSubject = new BehaviorSubject<GameAction[]>([]);
    this.newActionSubject = new BehaviorSubject<GameAction[]>([]);
    this.gameId = id;

    this.loadAllActions(onSucces);

    // Search for updates on fixed interval.
    this.intervalFunctionId = setInterval(
      () => this.refreshMethod(),
      GameActionService.ACTION_REFRESH_INTERVAL
    );

    return this.getNewItems();
  }

  public loadAllActions(onSucces: (actions: GameAction[]) => void): void {
    this.getAllActions(this.gameId)
      .subscribe(
        actions => {
          let trueCopyArray = GameActionUtil.trueCopyArray(actions);

          this.allActionSubject.next(trueCopyArray);
          onSucces(trueCopyArray);
        }
      );
  }

  public refreshActions(onSucces: () => void) {
    let newestActionId = this.getNewestActionId();

    this.getActionNewerThan(this.gameId, newestActionId).subscribe(actions => {
      let trueCopyItems: GameAction[] = GameActionUtil.trueCopyArray(actions);

      this.allActionSubject.next(this.allActionSubject.getValue().concat(trueCopyItems));
      this.newActionSubject.next(trueCopyItems);

      onSucces();
    });
  }

  private refreshMethod(): void {
    if (this.gameId == undefined) return;

    let newestActionId = this.getNewestActionId();

    if (newestActionId === undefined) return;

    this.refreshActions(() => {
    });
  }

  private getNewestActionId(): number | undefined {
    let allActions: GameAction[] = this.allActionSubject.getValue();

    return allActions.length !== 0
      ? allActions[allActions.length - 1].id
      : undefined;
  }

  public getAll(): Observable<GameAction[]> {
    return this.allActionSubject.asObservable();
  }

  public getNewItems(): Observable<GameAction[]> {
    return this.newActionSubject.asObservable();
  }

  public postDiceRoll(gameId): Observable<DiceRollAction> {
    return this.http.post<DiceRollAction>(
      `${GameActionService.API_ROUTE(gameId)}/rollDice`,
      null
    );
  }

  public postDrawChestCard(
    gameId: number,
    onSucces: (any) => void,
    onError: (any) => void
  ): void {
    this.http.post<DrawCardAction>(
      `${GameActionService.API_ROUTE(gameId)}/card/draw/chest`,
      null
    ).subscribe(
      onSucces,
      onError
    );
  }

  private getAllActions(gameId: number): Observable<GameAction[]> {
    return this.http.get<GameAction[]>(`${GameActionService.API_ROUTE(gameId)}`);
  }

  private getActionNewerThan(gameId: number, gameActionId: number): Observable<GameAction[]> {
    return this.http.get<GameAction[]>(`${GameActionService.API_ROUTE(gameId)}/${gameActionId}`);
  }

  public postDrawChanceCard(
    gameId: number,
    onSucces: (any) => void,
    onError: (any) => void
  ): void {
    this.http.post<DrawCardAction>(
      `${GameActionService.API_ROUTE(gameId)}/card/draw/chance`,
      null
    ).subscribe(
      onSucces,
      onError
    );
  }

  public postBuyLocation(
    gameId: number,
    locationId: number,
    onSucces: (any) => void,
    onError: (any) => void
  ): void {
    this.http.post<DrawCardAction>(
      `${GameActionService.API_ROUTE(gameId)}/location/buy/${locationId}`,
      null
    ).subscribe(
      onSucces,
      onError
    );
  }

  public postDevelopLocation(
    gameId: number,
    locationId: number,
    toStage: PropertyDevelopmentStage,
    onSucces: (any) => void,
    onError: (any) => void
  ): void {
    this.http.post<DrawCardAction>(
      `${GameActionService.API_ROUTE(gameId)}/location/develop/${locationId}/${toStage}`,
      null
    ).subscribe(
      onSucces,
      onError
    );
  }
}
