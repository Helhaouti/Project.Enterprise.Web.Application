import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DiceRollAction} from "../../../domain/models/game/action/impl/gamePlay/DiceRollAction";
import {GameStateManagerService} from "../../../services/game-state-manager/game-state-manager.service";

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {
  showDice: Boolean = false;
  diceRollAmount: number;
  diceOne = 0;
  diceTwo = 0;

  diceRollAmountDescription: string = "Your roll is";

  constructor(
    private gameStateManager: GameStateManagerService,
    private bottomSheetRef: MatBottomSheetRef<DiceComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public diceRollAction: DiceRollAction
  ) {
    this.diceOne = diceRollAction.firstDiceValue;
    this.diceTwo = diceRollAction.secondDiceValue;
    this.diceRollAmount = this.diceOne + this.diceTwo;

    if (gameStateManager.getCurrentPlayer().id !== diceRollAction.actor.id)
      this.diceRollAmountDescription = `${diceRollAction.actor.user.username} rolled`

    this.onShowDice();
  }

  private onShowDice() {
    this.showDice = true;

    setTimeout(() => {
      this.bottomSheetRef.dismiss(this.diceRollAmount);
    }, 2500)
  }
}
