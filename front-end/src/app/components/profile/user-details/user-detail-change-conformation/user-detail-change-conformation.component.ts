import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UpdateUserRequest} from "../../../../domain/dto/UpdateUserRequest";
import {PlayerRepository} from "../../../../repositories/player.repository";
import {AuthService} from "../../../../services/authentication/auth.service";
import {Subscription} from "rxjs";
import {SnackbarService} from "../../../../services/snackbar/snackbar.service";
import {LoginRequest} from "../../../../domain/dto/LoginRequest";

/**
 * A pop-up for the confirmation of the changes a user has made to his profile.
 *
 * @author Hamza el Haouti
 */
@Component({
  selector: 'app-user-detail-change-conformation',
  templateUrl: './user-detail-change-conformation.component.html',
  styleUrls: ['./user-detail-change-conformation.component.scss']
})
export class UserDetailChangeConformationComponent implements OnDestroy {
  changedValues: { key: string, value: string }[] = [];

  private updateUserSub: Subscription | undefined = undefined;

  constructor(
    private playerRepo: PlayerRepository,
    public dialogRef: MatDialogRef<UserDetailChangeConformationComponent>,
    private snackbar: SnackbarService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public updateUserRequest: UpdateUserRequest,
  ) {
    for (const [key, value] of Object.entries(this.updateUserRequest.toJson()))
      if (key !== "id"
        && key !== "loginRequest"
        && value !== null) this.changedValues.push({key: key, value: value});
  }

  ngOnDestroy() {
    this.updateUserSub?.unsubscribe();
  }

  /**
   * Sends a request to the server with the fields that need to be changed, and the credentials.
   */
  onSubmit(nickName: string, password: string) {
    this.updateUserRequest.loginRequest = new LoginRequest(nickName, password);

    this.updateUserSub = this.playerRepo.update(
      this.updateUserRequest,
      (response) => {
        this.snackbar.openSuccesSnackbar({message: "Changes have been made successfully", action: undefined});
        this.authService.setSession(response);
        this.dialogRef.close();
      },
      this.snackbar.displayErrorMessage
    );
  }
}
