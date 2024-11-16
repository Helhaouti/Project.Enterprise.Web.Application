package nl.hva.backend.domain.models.game.action.impl.card;

import lombok.NoArgsConstructor;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.GameAssetBidAction;
import nl.hva.backend.domain.models.game.card.impl.JailBreakCard;

import javax.persistence.Entity;


@Entity
@NoArgsConstructor
public class CardBidAction extends GameAssetBidAction {

  public CardBidAction(
    Player actor,
    JailBreakCard.JailBreakCardBid bid
  ) {
    super(actor, bid);
  }

  @Override
  public JailBreakCard.JailBreakCardBid getBid() {
    return (JailBreakCard.JailBreakCardBid) super.getBid();
  }

}