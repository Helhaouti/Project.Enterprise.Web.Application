import {Component, OnDestroy} from '@angular/core';
import {GameStateManagerService} from "../../../../../services/game-state-manager/game-state-manager.service";

@Component({
  selector: 'app-game-turn-tracker',
  templateUrl: './game-turn-tracker.component.html',
  styleUrls: ['./game-turn-tracker.component.scss']
})
export class GameTurnTrackerComponent implements OnDestroy {
  public turnTrackerVisible: boolean;

  public minutesUntilTurnEnd!: number;
  public secondsUntilTurnEnd!: number;

  private countdownTo: number | undefined;
  private intervalFunctionId!: ReturnType<typeof setInterval>;

  constructor(
    private stateManagerService: GameStateManagerService
  ) {
    this.stateManagerService
      .turnTrackerService
      .getTracker()
      .subscribe(tracker => this.countdownTo = tracker?.turnEndsAt.getTime());

    this.updateCounter();
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalFunctionId);
  }

  private updateCounter() {
    this.intervalFunctionId = setInterval(
      () => {
        if (this.countdownTo == undefined) return;

        // Find the distance between now and the count down date
        const distance = this.countdownTo - new Date().getTime();

        // Hide the turn tracker when the values are negative.
        this.turnTrackerVisible = distance > 0;

        this.minutesUntilTurnEnd = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.secondsUntilTurnEnd = Math.floor((distance % (1000 * 60)) / 1000);
      },
      500
    );
  }
}
