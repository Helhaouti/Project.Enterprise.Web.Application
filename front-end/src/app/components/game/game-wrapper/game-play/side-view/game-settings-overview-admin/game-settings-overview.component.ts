import {Component, OnInit} from '@angular/core';
import {GameRepository} from "../../../../../../repositories/game.repository";
import {GameSession} from "../../../../../../domain/models/game/GameSession";
import {ActivatedRoute} from "@angular/router";
import {DialogService} from "../../../../../../services/dialog/dialog.service";
import {EditSettingsPopUpComponent} from "../../../../../pop-ups/edit-settings-pop-up/edit-settings-pop-up.component";
import {GameActionService} from "../../../../../../services/game/gameActionService";

@Component({
  selector: 'app-game-settings-overview-admin',
  templateUrl: './game-settings-overview.component.html',
  styleUrls: ['./game-settings-overview.component.scss']
})
export class GameSettingsOverviewComponent implements OnInit {
  private id: number;
  public game: GameSession;
  private timedFunctionId: ReturnType<typeof setInterval>;
  public gameEndsAt: string;

  constructor(
    private route: ActivatedRoute,
    private gameRepo: GameRepository,
    private dialogService: DialogService
  ) {
    this.route.parent.params.subscribe((params) => {
      this.id = parseInt(params["id"]);
    })


    this.gameRepo.getBy(
      this.id,
      game => {
        this.game = game;
        this.gameEndsAt = new Date(game.endsAt).toLocaleTimeString();
      },
      error => {
        console.log(error)
      }
    );

    this.settingsUpdate();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    window.clearInterval(this.timedFunctionId);
  }

  settingsUpdate() {
    this.timedFunctionId = setInterval(() => {
      this.gameRepo.getBy(
        this.id,
        game => {
          this.game = game;
          this.gameEndsAt = new Date(game.endsAt).toLocaleTimeString();
        },
        error => {
          console.log(error);
        }
      );

    }, GameActionService.ACTION_REFRESH_INTERVAL);
  }

  editSettings() {
    this.dialogService.openCardSizedDialogFrom(EditSettingsPopUpComponent, this.game);
  }
}
