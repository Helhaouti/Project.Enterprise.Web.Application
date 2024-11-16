import {Injectable} from '@angular/core';
import {ProfilePictureRepository} from "../../repositories/profile-picture.repository";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {
  ProfilePicManagerComponent
} from "../../components/profile/my-profile/profile-pic-manager/profile-pic-manager.component";

/**
 * Service for the retrieval of cached profile pictures of a user.
 *
 * @author Hamza el Haouti
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  private profilePicsPerUser: Map<number, SafeResourceUrl> = new Map<number, SafeResourceUrl>();

  constructor(
    private profilePicRepo: ProfilePictureRepository,
    private sanitizer: DomSanitizer
  ) {
  }

  public getBy(userId: number, onSucces: (arg0: SafeResourceUrl) => void): void {
    if (this.profilePicsPerUser.has(userId)) {
      onSucces(this.profilePicsPerUser.get(userId)!);
      return;
    }

    this.profilePicRepo.getBy(userId).subscribe(
      event => {
        // Retrieve the profile picture and convert it to a File.
        const RESPONSE_BODY_AVAILABLE: number = 4;
        if (event.type !== RESPONSE_BODY_AVAILABLE) return;

        const profilePic = new File([event.body], `${userId}.png`);

        // Read the profile picture and convert it to usable url.
        let reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result !== "string") return;

          const profilePictureSource = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result);

          this.profilePicsPerUser.set(userId, profilePictureSource);
          onSucces(profilePictureSource);
        }

        reader.readAsDataURL(profilePic);
      },
      () => {
        const profilePictureSource =
          this.sanitizer.bypassSecurityTrustResourceUrl(ProfilePicManagerComponent.PROFILE_PICTURE_PLACEHOLDER);
        this.profilePicsPerUser.set(userId, profilePictureSource);
        onSucces(profilePictureSource);
      });
  }
}
