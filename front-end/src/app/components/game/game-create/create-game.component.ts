import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {SnackbarService} from "../../../services/snackbar/snackbar.service";
import {CreateGameRequest} from "../../../domain/dto/CreateGameRequest.dto";
import {GameRepository} from "../../../repositories/game.repository";

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {
  maxPlayersArray: number[] = [];
  minutesBeforeGameStartArray: number[] = [];
  minutesBeforeTurnArray: number[] = [];
  maxGameTimeArray: number[] = [];

  maxAmountOfPlayerChoice!: number;
  minutesBeforeGameStartsChoice!: number
  minutesPerTurnChoice!: number;
  maxGameTimeChoice!: number;

  constructor(
    private gameRepo: GameRepository,
    private snackbar: SnackbarService,
    private router: Router
  ) {
    this.fillArrays();
  }

  createGame(): void {
    if (
      this.maxAmountOfPlayerChoice == undefined
      || this.minutesBeforeGameStartsChoice == undefined
      || this.minutesPerTurnChoice == undefined
      || this.maxGameTimeChoice == undefined
    ) {
      this.snackbar.openWarningSnackbar({message: "Not all fields have been filled in.", action: undefined});
      return;
    }

    // @ts-ignore
    const game = new CreateGameRequest(
      this.maxAmountOfPlayerChoice,
      this.minutesBeforeGameStartsChoice,
      this.minutesPerTurnChoice,
      this.maxGameTimeChoice
    );

    this.gameRepo.create(
      game,
      gameSession => {
        this.snackbar.openSuccesSnackbar({message: `Game has been created.`, action: undefined});
        this.router.navigate(["game/", gameSession.id])
      },
      this.snackbar.displayErrorMessage
    );
  }

  fillArrays() {
    for (let i = 5; i <= 60; i++) this.minutesBeforeGameStartArray.push(i);
    for (let i = 2; i <= 4; i++) this.maxPlayersArray.push(i);
    for (let i = 1; i <= 5; i++) this.minutesBeforeTurnArray.push(i);
    for (let i = 1; i <= 4; i++) this.maxGameTimeArray.push(i);
  }

  onBack() {
    this.router.navigate(["../../game"]);
  }
}
