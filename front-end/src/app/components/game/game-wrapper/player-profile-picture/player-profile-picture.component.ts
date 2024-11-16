import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SafeResourceUrl} from "@angular/platform-browser";
import {Player} from "../../../../domain/models/game/Player";
import {ProfilePictureService} from "../../../../services/ProfilePicture/profile-picture.service";
import {DialogService} from "../../../../services/dialog/dialog.service";
import {
  PlayerInformationOverviewPopUpComponent
} from "../game-play/player-information-overview-pop-up/player-information-overview-pop-up.component";

@Component({
  selector: 'app-player-profile-picture',
  templateUrl: './player-profile-picture.component.html',
  styleUrls: ['./player-profile-picture.component.scss']
})
export class PlayerProfilePictureComponent {
  private static readonly PROFILE_PICTURE_PLACEHOLDER: string =
    "/assets/images/profile/male-default-placeholder-avatar-profile.png";

  public profilePictureSource: string | SafeResourceUrl = PlayerProfilePictureComponent.PROFILE_PICTURE_PLACEHOLDER;
  private _player: Player;

  @Output("onPictureClick") onProfileClick: EventEmitter<Player> = new EventEmitter<Player>();
  @Input("size") size: "small" | "medium" | "big";

  constructor(
    private dialogService: DialogService,
    private profilePicService: ProfilePictureService
  ) {
  }

  onClick() {
    this.dialogService.openCardSizedDialogFrom(PlayerInformationOverviewPopUpComponent, this._player);
    this.onProfileClick.emit(this._player);
  }

  @Input("player")
  set newPlayer(player: Player) {
    if (player == undefined || player.user == undefined) return;

    this._player = player;

    this.profilePicService.getBy(
      player.user.id,
      picUrl => this.profilePictureSource = picUrl
    );
  }
}
