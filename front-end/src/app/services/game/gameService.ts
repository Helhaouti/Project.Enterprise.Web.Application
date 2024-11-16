import {Injectable, OnDestroy} from "@angular/core";
import {GameRepository} from "../../repositories/game.repository";
import {BehaviorSubject, Observable} from "rxjs";
import {GameSession} from "../../domain/models/game/GameSession";

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {
  public static REFRESH_INTERVAL: number = 10000;

  private gameSubject: BehaviorSubject<GameSession> | undefined;
  private gameId: number | undefined;
  private intervalFunctionId: ReturnType<typeof setInterval>;

  constructor(
    private gameRepo: GameRepository
  ) {
  }

  ngOnDestroy(): void {
    this.terminate();
  }

  public terminate(): void {
    window.clearInterval(this.intervalFunctionId);
    this.gameSubject?.complete();
  }

  public start(game: GameSession): Observable<GameSession> {
    // Stop previous work, if any.
    this.terminate();

    // Initialize service for new game.
    this.gameSubject = new BehaviorSubject<GameSession>(GameSession.trueCopy(game)!)
    this.gameId = game.id;

    // Search for updates on fixed interval.
    this.intervalFunctionId = setInterval(
      () => {
        if (this.gameId == undefined) return;

        this.refreshActions(() => {
        });
      },
      GameService.REFRESH_INTERVAL
    );

    return this.getGame();
  }

  public getGame(): Observable<GameSession> | undefined {
    return this.gameSubject?.asObservable();
  }

  public refreshActions(onSucces: () => void) {
    this.gameRepo.getBy(
      this.gameId,
      game => {
        this.gameSubject?.next(GameSession.trueCopy(game)!);
        onSucces();
      },
      () => {
      }
    );
  }

}
