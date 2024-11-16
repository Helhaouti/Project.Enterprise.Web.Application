import {Component} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../../services/authentication/auth.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {User} from "../../../../domain/models/user.model";
import {SnackbarService} from "../../../../services/snackbar/snackbar.service";
import {ProfilePictureRepository} from "../../../../repositories/profile-picture.repository";

/**
 * Component that displays the currently logged in user's profile picture, and gives him the ability to modify it.
 *
 * @author Hamza el Haouti
 */
@Component({
  selector: 'app-profile-pic-manager',
  templateUrl: './profile-pic-manager.component.html',
  styleUrls: ['./profile-pic-manager.component.scss']
})
export class ProfilePicManagerComponent {
  public static readonly PROFILE_PICTURE_PLACEHOLDER: string =
    "/assets/images/profile/male-default-placeholder-avatar-profile.png";

  // @ts-ignore
  public currentUser!: User;
  public profilePictureSource: string | SafeResourceUrl = ProfilePicManagerComponent.PROFILE_PICTURE_PLACEHOLDER;

  constructor(private authService: AuthService,
              private profilePicService: ProfilePictureRepository,
              private sanitizer: DomSanitizer,
              private snackbar: SnackbarService) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user!;
      this.getProfilePicture();
    });
  }

  /**
   * Simulates a click on a HTMLInputElement.
   *
   * @param fileInput The HTMLInputElement where a click should be simulated.
   */
  onSelectProfilePic(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  /**
   * Uploads the selected picture in the provided HTMLInputElement, when a picture is provided of the type of png.
   * Otherwise it displays an error in a snackbar.
   *
   * @param fileInput The HTMLInputElement where the files need to be retrieved from.
   */
  onFileChange(fileInput: HTMLInputElement): void {
    const profilePic: File | null = fileInput.files != null ? fileInput.files[0] : null;

    if (profilePic != null && profilePic.type === "image/png") this.uploadProfilePicture(profilePic);
    else this.displayError("Unable to set the selected file as a profile picture, provide a valid png image.")
  }

  /**
   * Displays a snackbar styled for warnings, with the provided message.
   */
  displayError(message: string) {
    this.snackbar.openWarningSnackbar({message: message, action: undefined});
  }

  /**
   * Displays a snackbar styled for success messages, with the provided message.
   */
  displaySucces(message: string) {
    this.snackbar.openSuccesSnackbar({message: message, action: undefined});
  }

  /**
   * Deletes the currently logged in user's profile picture,
   * and notifies via a snackbar, when this has succeeded/failed.
   *
   */
  public onDeleteProfilePicture(): void {
    this.profilePicService.deleteBy(this.currentUser.id).subscribe(
      (event) => {
        this.profilePictureSource = ProfilePicManagerComponent.PROFILE_PICTURE_PLACEHOLDER;
        this.displaySucces("Profile picture deleted successfully.");
      },
      (event) => {
        this.displayError("Unable to delete profile picture.")
      }
    )
  }

  /**
   * Sets the provided file as the currently logged in user's profile picture,
   * and notifies via a snackbar, when this has succeeded/failed.
   *
   * @param file A profile picture in png format.
   */
  private uploadProfilePicture(file: File): void {
    const formData = new FormData();
    formData.set('profile_picture', file);

    this.profilePicService.upload(formData, this.currentUser.id).subscribe(
      event => {
        this.setAsProfilePicture(file);
        this.displaySucces("Profile picture set successfully.");
      },
      (error: HttpErrorResponse) => {
        this.displayError("Unable to upload selected profile picture.")
      }
    );
  }

  /**
   * Retrieves the currently logged in user's profile picture, and displays this.
   */
  private getProfilePicture(): void {
    this.profilePicService.getBy(this.currentUser.id).subscribe(
      event => {
        const RESPONSE_BODY_AVAILABLE = 4;

        if (event.type === RESPONSE_BODY_AVAILABLE)
          this.setAsProfilePicture(new File(
            // @ts-ignore
            [event.body],
            `${this.currentUser.id}.png`)
          );
      }, () => {
      });
  }

  /**
   * Displays the provided profile picture in the view.
   *
   * @param file A profile picture in png format.
   */
  private setAsProfilePicture(file: File): void {
    let reader = new FileReader();

    reader.onload = (event: any) => {
      if (typeof reader.result !== "string") return;

      this.profilePictureSource = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
    }

    reader.readAsDataURL(file);
  }

}
