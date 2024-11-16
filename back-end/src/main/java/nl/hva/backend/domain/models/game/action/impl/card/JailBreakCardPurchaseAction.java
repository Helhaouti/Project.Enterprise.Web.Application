package nl.hva.backend.domain.models.game.action.impl.card;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.AssetPurchaseAction;
import nl.hva.backend.domain.models.game.card.impl.JailBreakCard;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class JailBreakCardPurchaseAction extends AssetPurchaseAction {

  @ManyToOne
  private JailBreakCard card;

  public JailBreakCardPurchaseAction(
    Player buyer,
    Player previousOwner,
    double purchasePrice,
    JailBreakCard card
  ) {
    super(buyer, previousOwner, purchasePrice);
    this.card = card;
  }

}