package nl.hva.backend.domain.models.game.board.location.locationImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.Objects;


@Entity
@NoArgsConstructor
@Getter
@Setter
public class Property extends OwnableLocation {

  private PropertyColor color;
  private String name;
  private double propertyDevelopmentCost;

  private double rentWithNoHouse;
  private double rentWithOneHouse;
  private double rentWithTwoHouses;
  private double rentWithThreeHouses;
  private double rentWithFourHouses;
  private double rentWithHotel;

  public Property(
    long id,
    int position,
    String description,
    GameBoard gameBoard,
    double initialPurchasePrice,
    PropertyColor color,
    String name,
    double propertyDevelopmentCost,
    double rentWithNoHouse,
    double rentWithOneHouse,
    double rentWithTwoHouses,
    double rentWithThreeHouses,
    double rentWithFourHouses,
    double rentWithHotel
  ) {
    super(id, position, description, gameBoard, initialPurchasePrice);
    this.color = color;
    this.name = name;
    this.propertyDevelopmentCost = propertyDevelopmentCost;
    this.rentWithNoHouse = rentWithNoHouse;
    this.rentWithOneHouse = rentWithOneHouse;
    this.rentWithTwoHouses = rentWithTwoHouses;
    this.rentWithThreeHouses = rentWithThreeHouses;
    this.rentWithFourHouses = rentWithFourHouses;
    this.rentWithHotel = rentWithHotel;
  }

  @Entity
  @Getter
  @NoArgsConstructor
  public static class PropertyDevelopmentStageTracker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    private Property property;

    @Setter
    private PropertyDevelopmentStage developmentStage;

    public PropertyDevelopmentStageTracker(Property property) {
      this.property = property;
      this.developmentStage = PropertyDevelopmentStage.NO_DEVELOPMENT;
    }

    /**
     * Checks whether this property belongs to this Tracker.
     *
     * @param property The property to be assessed.
     * @return Whether this property belongs to this Tracker.
     */
    public boolean isOf(Property property) {
      return Objects.equals(this.getProperty(), property);
    }

  }


  @Getter
  public enum PropertyColor {
    LIGHT_BLUE,
    DARK_PURPLE,
    ORANGE,
    PURPLE,
    RED,
    YELLOW,
    GREEN,
    DARK_BLUE
  }


  public enum PropertyDevelopmentStage {
    NO_DEVELOPMENT(0),
    ONE_HOUSE(1),
    TWO_HOUSES(2),
    THREE_HOUSES(3),
    FOUR_HOUSES(4),
    HOTEL(5);

    public final int STAGE;

    PropertyDevelopmentStage(int STAGE) {
      this.STAGE = STAGE;
    }
  }

}