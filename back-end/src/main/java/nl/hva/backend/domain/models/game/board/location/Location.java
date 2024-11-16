package nl.hva.backend.domain.models.game.board.location;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.locationImpl.BoardCorner;
import nl.hva.backend.domain.models.game.board.location.locationImpl.PickCardLocation;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;
import nl.hva.backend.domain.models.game.board.location.locationImpl.RailRoad;
import nl.hva.backend.domain.models.game.board.location.locationImpl.TaxLocation;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Utility;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


// JPA
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "GameboardLocation")

// Lombok config.
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

// Jackson ORM config for inheritance.
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "classType"
)
@JsonSubTypes({
  @JsonSubTypes.Type(value = BoardCorner.class, name = "BoardCorner"),
  @JsonSubTypes.Type(value = PickCardLocation.class, name = "PickCardLocation"),
  @JsonSubTypes.Type(value = Property.class, name = "Property"),
  @JsonSubTypes.Type(value = TaxLocation.class, name = "TaxLocation"),
  @JsonSubTypes.Type(value = Utility.class, name = "Utility"),
  @JsonSubTypes.Type(value = RailRoad.class, name = "RailRoad")
})
public abstract class Location {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private int position;
  private String description;

  @ManyToOne
  @JsonBackReference
  private GameBoard gameBoard;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Location location)) return false;
    return getId() == location.getId();
  }

  @Override
  public int hashCode() {
    return (int) (getId() ^ (getId() >>> 32));
  }

}