import {Component, Input} from '@angular/core';
import {GameActionService} from "../../../../../../services/game/gameActionService";
import {GameAction} from "../../../../../../domain/models/game/action/GameAction";

@Component({
  selector: 'app-game-action-overview',
  templateUrl: './game-action-overview.component.html',
  styleUrls: ['./game-action-overview.component.scss']
})
export class GameActionOverviewComponent {
  @Input("size") size: "small" | "medium" | "big";
  public actions: GameAction[] = [];

  constructor(
    private gameActionService: GameActionService
  ) {
    this.gameActionService
      .getAll()
      .subscribe(actions => this.actions = actions);
  }

}
