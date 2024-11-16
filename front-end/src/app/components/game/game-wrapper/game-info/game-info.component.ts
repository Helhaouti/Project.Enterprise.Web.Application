import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Player} from "../../../../domain/models/game/Player";
import {GameRepository} from "../../../../repositories/game.repository";
import {SnackbarService} from "../../../../services/snackbar/snackbar.service";
import {GameSession, GameSessionState} from "../../../../domain/models/game/GameSession";
import {GameActionService} from "../../../../services/game/gameActionService";
import {WinGameAction} from "../../../../domain/models/game/action/impl/gamePlay/WinGameAction";

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit {
  winner: Player;
  gameSession: GameSession;
  isStarted: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameRepo: GameRepository,
    private snackbar: SnackbarService,
    private gameActionService: GameActionService
  ) {
    this.route.parent.params.subscribe(params => {
        let gameId = parseInt(params["id"]);

        this.gameRepo.getBy(
          gameId,
          gameSession => {
            this.gameSession = GameSession.trueCopy(gameSession);

            this.validateGameState();

            for (const action of this.gameSession.actions)
              if (action instanceof WinGameAction) this.winner = (<WinGameAction>action).actor;

            this.gameActionService.start(
              gameId,
              () => this.isStarted = true
            );

          },
          this.snackbar.displayErrorMessage
        );
      }
    );
  }

  goToGameOverview() {
    this.router.navigate(["game"]);
  }

  ngOnInit(): void {

  }

  private validateGameState(): void {
    if (this.gameSession.state == GameSessionState.JOINABLE) {
      this.snackbar.openSuccesSnackbar(
        {message: "The game has not yet started. Wait until there are enough members.", action: undefined});
      this.router.navigate(["lobby"], {relativeTo: this.route.parent});

    } else if (this.gameSession.state == GameSessionState.STARTED) {
      this.snackbar.openWarningSnackbar({message: "The game can still be played.", action: undefined});
      this.router.navigate(["info"], {relativeTo: this.route.parent});
    }
  }
}
