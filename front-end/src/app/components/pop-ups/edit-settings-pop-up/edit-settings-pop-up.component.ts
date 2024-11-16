import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GameSession} from "../../../domain/models/game/GameSession";
import {GameRepository} from "../../../repositories/game.repository";
import {UpdateGameRequest} from "../../../domain/dto/UpdateGameRequest.dto";
import {SnackbarService} from "../../../services/snackbar/snackbar.service";

@Component({
  selector: 'app-edit-settings-pop-up',
  templateUrl: './edit-settings-pop-up.component.html',
  styleUrls: ['./edit-settings-pop-up.component.scss']
})
export class EditSettingsPopUpComponent implements OnInit {
  minutesBeforeTurnArray: number[] = [];
  maxGameTimeArray: number[] = [];
  minutesPerTurnChoice!: number;
  maxGameTimeChoice!: number;

  constructor(@Inject(MAT_DIALOG_DATA) public gameSession: GameSession, private gameRepo: GameRepository,
              private dialogRef: MatDialogRef<EditSettingsPopUpComponent>, private snackbar: SnackbarService,) {
    this.fillArrays();
  }

  ngOnInit(): void {

  }

  onSubmit() {
    const updatedGame = new UpdateGameRequest(
      this.minutesPerTurnChoice,
      this.maxGameTimeChoice
    );


    this.gameRepo.update(
      updatedGame, this.gameSession.id,
      gameSession => {
        this.snackbar.openSuccesSnackbar({message: "Session has been edited!", action: undefined});
        this.dialogRef.close();
      },
      error => {
        this.snackbar.openWarningSnackbar({
          message: "Please fill in all the values to edit a session",
          action: undefined
        });
        this.dialogRef.close();
      }
    );
  }

  fillArrays() {
    for (let i = 1; i <= 5; i++) this.minutesBeforeTurnArray.push(i);
    for (let i = 1; i <= 4; i++) this.maxGameTimeArray.push(i);
  }
}
