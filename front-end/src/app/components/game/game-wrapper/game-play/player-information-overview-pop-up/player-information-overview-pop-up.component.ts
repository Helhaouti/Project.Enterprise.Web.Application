import {Component, Inject} from '@angular/core';
import {SnackbarService} from "../../../../../services/snackbar/snackbar.service";
import {GameStateManagerService} from "../../../../../services/game-state-manager/game-state-manager.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Player} from "../../../../../domain/models/game/Player";

@Component({
  selector: 'app-player-information-overview-pop-up',
  templateUrl: './player-information-overview-pop-up.component.html',
  styleUrls: ['./player-information-overview-pop-up.component.scss']
})
export class PlayerInformationOverviewPopUpComponent {

  constructor(
    public snackbar: SnackbarService,
    public gameStateManagerService: GameStateManagerService,
    private dialogRef: MatDialogRef<PlayerInformationOverviewPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public player: Player,
  ) {
  }

  onClose() {
    this.dialogRef.close();
  }

}
