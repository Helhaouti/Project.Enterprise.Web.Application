package nl.hva.backend.domain.models.game.board.location;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.GameAsset;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.board.GameBoard;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;


@Entity
@Getter
@Setter
@NoArgsConstructor
public abstract class OwnableLocation extends Location implements GameAsset {

  private double initialPurchasePrice;

  protected OwnableLocation(
    long id,
    int position,
    String description,
    GameBoard gameBoard,
    double initialPurchasePrice
  ) {
    super(id, position, description, gameBoard);
    this.initialPurchasePrice = initialPurchasePrice;
  }

  @Entity
  @Getter
  @Setter
  @NoArgsConstructor
  public static class OwnableLocationBid extends GameAssetBid {

    @ManyToOne
    private OwnableLocation location;

    public OwnableLocationBid(
      Player owner,
      Player bidder,
      double amount,
      OwnableLocation location
    ) {
      super(owner, bidder, amount);
      this.location = location;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (!(o instanceof OwnableLocationBid that)) return false;
      return getId() == that.getId();
    }

    @Override
    public int hashCode() {
      return Long.hashCode(getId());
    }

  }

}