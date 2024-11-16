import {Component} from '@angular/core';
import {GameStateManagerService} from "../../../../../../services/game-state-manager/game-state-manager.service";
import {Player} from "../../../../../../domain/models/game/Player";

@Component({
  selector: 'app-leaderboard-overview',
  templateUrl: './leaderboard-overview.component.html',
  styleUrls: ['./leaderboard-overview.component.scss']
})
export class LeaderboardOverviewComponent {
  players: Player[] = [];
  currentTurnNumber: number = 1;

  constructor(
    private gameStateManagerService: GameStateManagerService,
  ) {
    this.gameStateManagerService
      .getGame()
      .subscribe(game => this.players = game.players.sort(Player.compareRank));

    this.gameStateManagerService
      .turnTrackerService
      .getTracker()
      .subscribe(tracker => this.currentTurnNumber = tracker?.currentTurn);
  }

}
