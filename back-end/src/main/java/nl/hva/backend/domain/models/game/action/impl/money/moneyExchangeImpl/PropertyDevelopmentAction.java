package nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;


/**
 * Representation, of the action, of paying for the development of property to the bank.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class PropertyDevelopmentAction extends MoneyExchangeAction {

  @Enumerated(EnumType.STRING)
  private Property.PropertyDevelopmentStage fromStage;

  @Enumerated(EnumType.STRING)
  private Property.PropertyDevelopmentStage toStage;

  @ManyToOne
  private Property property;

  // TODO: Add fromStage for later action reversibility

  /**
   * Constructor for the manual creation of an instance, that is intended to be persisted to JPA.
   *
   * @param developer       Player paying for the development.
   * @param fromStage       Original development level of the property.
   * @param toStage         New development level of the property.
   * @param developmentCost Cost of development.
   * @param property        The property being developed.
   */
  public PropertyDevelopmentAction(
    Player developer,
    Property.PropertyDevelopmentStage fromStage,
    Property.PropertyDevelopmentStage toStage,
    double developmentCost,
    Property property
  ) {
    super(developer, null, developmentCost);
    this.fromStage = fromStage;
    this.toStage = toStage;
    this.property = property;
  }

}