import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GameStateManagerService} from "../../../services/game-state-manager/game-state-manager.service";
import {DrawCardAction} from "../../../domain/models/game/action/impl/card/DrawCardAction";
import {Card, CardType} from "../../../domain/models/game/card/Card";

@Component({
  selector: 'app-pick-card-pop-up',
  templateUrl: './pick-card-location-pop-up.component.html',
  styleUrls: ['./pick-card-location-pop-up.component.scss']
})
export class PickCardLocationPopUpComponent {
  public cardPickerDescription: string = "You picked ";
  public cardTypeDescription: string;
  public pickedCard: Card;

  public constructor(
    private gameStateManager: GameStateManagerService,
    private dialogRef: MatDialogRef<PickCardLocationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public drawCardAction: DrawCardAction
  ) {
    if (gameStateManager.getCurrentPlayer().id !== drawCardAction.actor.id)
      this.cardPickerDescription = `${drawCardAction.actor.user.username} picked`;

    this.pickedCard = drawCardAction.card;

    if (this.pickedCard.type === CardType.CHEST) this.cardTypeDescription = "Chest card";
    else if (this.pickedCard.type === CardType.CHANCE) this.cardTypeDescription = "Chance card";
  }

  public onClick(): void {
    this.dialogRef.close()
  }
}
