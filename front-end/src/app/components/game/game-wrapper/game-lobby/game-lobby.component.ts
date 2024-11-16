import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameSession, GameSessionState} from "../../../../domain/models/game/GameSession";
import {GameService} from "../../../../services/game/gameService";
import {SnackbarService} from "../../../../services/snackbar/snackbar.service";
import {AuthService} from "../../../../services/authentication/auth.service";
import {GameRepository} from "../../../../repositories/game.repository";

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.scss']
})
export class GameLobbyComponent implements OnDestroy {
  public gameSession: GameSession;
  public gameRefreshInterval: number = 0;
  private timedFunctionId: ReturnType<typeof setInterval>;
  private game: GameSession;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService,
    private gameRepo: GameRepository,
    private snackbar: SnackbarService,
    private authService: AuthService,
  ) {
    this.route.parent.params.subscribe(params => {
      let id: number = parseInt(params["id"]);

      if (isNaN(id)) this.onBack();
      else this.gameRepo.getBy(
        id,
        game => this.init(game),
        error => {
          this.snackbar.displayErrorMessage(error);
          this.onBack();
        }
      );
    });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.timedFunctionId);
    this.gameService.terminate();
  }

  incrementSpinner(): void {
    let increment = GameService.REFRESH_INTERVAL / 10;

    this.timedFunctionId = setInterval(
      () => this.gameRefreshInterval += increment / (GameService.REFRESH_INTERVAL / 100),
      increment
    );
  }

  onLeaveGame() {
    if (!confirm("Are you sure you want to leave the lobby?")) return;

    const currentPlayerId = this.game.players.find(player =>
      player.user.id == this.authService.getCurrentUserSnapshot()?.id)?.id

    this.gameRepo.leaveGame(
      currentPlayerId,
      this.gameSession.id,
      () => this.navigateToGameOverview(),
      this.snackbar.displayErrorMessage
    );

  }

  onBack() {
    this.navigateToGameOverview();
  }

  onLoadGame() {
    this.gameService.refreshActions(() => {
    });
  }

  gameIsJoinable() {
    return this.gameSession != undefined && this.gameSession.state == GameSessionState.JOINABLE;
  }

  navigateToGameOverview(): void {
    this.router.navigate(["/game"]);
  }

  private init(game: GameSession): void {
    if (game.state == GameSessionState.STARTED) {
      this.snackbar.openSuccesSnackbar({message: "The game has started. Enjoy.", action: undefined});
      this.router.navigate(["play"], {relativeTo: this.route.parent});
      return;
    }

    this.gameService.start(game)
      .subscribe(
        game => this.checkGameState(game),
        this.snackbar.displayErrorMessage
      );

    this.game = game;

    this.incrementSpinner();
  }

  private checkGameState(game: GameSession): void {
    this.gameRefreshInterval = 0;
    this.gameSession = game;

    const currentPlayer = game?.players
      .find(player => player.user.id == this.authService.getCurrentUserSnapshot()?.id);

    if (currentPlayer == undefined) {
      this.snackbar.openWarningSnackbar({
        message: "You have not joined this game. Join to play.",
        action: undefined
      });
      this.navigateToGameOverview();
      return;
    }

    if (game.state == GameSessionState.STARTED) {
      this.snackbar.openSuccesSnackbar({message: "The game has started. Enjoy.", action: undefined});
      this.router.navigate(["play"], {relativeTo: this.route.parent});

    } else if (this.gameSession.state == GameSessionState.COMPLETED) {
      this.snackbar.openWarningSnackbar({message: "The game can no longer be played.", action: undefined});
      this.router.navigate(["info"], {relativeTo: this.route.parent});
    }
  }

}
