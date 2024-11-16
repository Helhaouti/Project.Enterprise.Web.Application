package nl.hva.backend.domain.models.game.card.impl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.GameAsset;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.card.Card;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ManyToOne;


/**
 * TODO JavaDoc
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class JailBreakCard extends Card implements GameAsset {

  private double initialPurchasePrice;

  /**
   * TODO JavaDoc
   */
  public JailBreakCard(
    String description,
    CardType type,
    double initialPurchasePrice
  ) {
    super(description, type);
    this.initialPurchasePrice = initialPurchasePrice;
  }


  /**
   * TODO JavaDoc
   *
   * @author Hamza el Haouti
   */
  @Entity
  @EntityListeners({AuditingEntityListener.class})
  @Getter
  @Setter
  @NoArgsConstructor
  public static class JailBreakCardBid extends GameAssetBid {

    @ManyToOne
    private JailBreakCard card;

    /**
     * TODO JavaDoc
     */
    public JailBreakCardBid(
      Player owner,
      Player bidder,
      double amount,
      JailBreakCard card
    ) {
      super(owner, bidder, amount);
      this.card = card;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (!(o instanceof JailBreakCardBid that)) return false;
      return getId() == that.getId();
    }

    @Override
    public int hashCode() {
      return (int) (getId() ^ (getId() >>> 32));
    }

  }

}