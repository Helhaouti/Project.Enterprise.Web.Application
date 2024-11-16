import {Component} from '@angular/core';
import {AuthService} from "../../../services/authentication/auth.service";
import {Router} from "@angular/router";
import {GameService} from "../../../services/game/gameService";
import {GameRepository} from "../../../repositories/game.repository";
import {SnackbarService} from "../../../services/snackbar/snackbar.service";
import {GameSession, GameSessionState} from "../../../domain/models/game/GameSession";

@Component({
  selector: 'app-game-overview',
  templateUrl: './game-overview.component.html',
  styleUrls: ['./game-overview.component.scss']
})
export class GameOverviewComponent {
  public joinableGames: GameSession[] = [];
  public gameHistory: GameSession[] = [];

  constructor(
    private gameRepo: GameRepository,
    private gameService: GameService,
    private snackbar: SnackbarService,
    private auth: AuthService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.gameRepo.getAllJoinable(
      games => games.forEach(game => this.joinableGames.push(GameSession.trueCopy(game))),
      this.snackbar.displayErrorMessage
    );

    this.gameRepo.getCurrentUserHistory(
      games => games.forEach(game => this.gameHistory.push(GameSession.trueCopy(game))),
      this.snackbar.displayErrorMessage
    );
  }

  onJoin(game: GameSession) {
    const ON_SUCCESFULL_GAME_JOIN: () => void = () => {
      this.router.navigate(["/game", game.id, "lobby"]);
      this.snackbar.openSuccesSnackbar({message: "Game joined succesfully.", action: undefined});
    };

    if (game.players.find(player => player.user.id == this.authService.getCurrentUserSnapshot()?.id) != undefined)
      ON_SUCCESFULL_GAME_JOIN();

    else this.gameRepo.joinBy(
      game.id,
      () => ON_SUCCESFULL_GAME_JOIN(),
      this.snackbar.displayErrorMessage
    );
  }

  onView(game: GameSession) {
    this.router.navigate(["/game", game.id, "info"])
    // this.snackbar.openWarningSnackbar({message: "Currently this button does nothing.", action: undefined})
  }

  checkIfJoinable(game: GameSession): boolean {
    return game.state == GameSessionState.JOINABLE || game.state == GameSessionState.STARTED
  }

  createNewGame() {
    this.router.navigate(["/game/create"]);
  }
}
