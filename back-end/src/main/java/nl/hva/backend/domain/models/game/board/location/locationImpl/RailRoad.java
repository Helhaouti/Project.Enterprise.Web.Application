package nl.hva.backend.domain.models.game.board.location.locationImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;

import javax.persistence.Entity;


@Entity
@NoArgsConstructor
@Getter
@Setter
public class RailRoad extends OwnableLocation {

  private String name;
  private double rent;
  private double rentIfTwoAreOwned;
  private double rentIfThreeOwned;
  private double rentIfFourAreOwned;

  public RailRoad(
    long id,
    int position,
    String description,
    GameBoard gameBoard,
    double initialPurchasePrice,
    String name,
    double rent,
    double rentIfTwoAreOwned,
    double rentIfThreeOwned,
    double rentIfFourAreOwned
  ) {
    super(id, position, description, gameBoard, initialPurchasePrice);
    this.name = name;
    this.rent = rent;
    this.rentIfTwoAreOwned = rentIfTwoAreOwned;
    this.rentIfThreeOwned = rentIfThreeOwned;
    this.rentIfFourAreOwned = rentIfFourAreOwned;
  }

}