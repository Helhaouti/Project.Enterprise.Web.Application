package nl.hva.backend.domain.models.game;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;


/**
 * TODO JavaDoc
 *
 * @author Hamza el Haouti
 */
public interface GameAsset {

  double getInitialPurchasePrice();

  /**
   * TODO JavaDoc
   *
   * @author Hamza el Haouti
   */
  @Entity
  @EntityListeners(AuditingEntityListener.class)
  @Getter
  @Setter
  @NoArgsConstructor
  abstract class GameAssetBid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    private Player owner;

    @ManyToOne
    private Player bidder;

    private double amount;

    @CreatedDate
    private LocalDateTime performedOn;

    /**
     * TODO JavaDoc
     */
    protected GameAssetBid(
      Player owner,
      Player bidder,
      double amount
    ) {
      this.owner = owner;
      this.bidder = bidder;
      this.amount = amount;
    }

  }

}