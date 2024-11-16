package nl.hva.backend.domain.models.game.card.impl;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.card.Card;

import javax.persistence.Entity;


/**
 * TODO JavaDoc
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class PayMoneyCard extends Card {

  private double amount;

  /**
   * TODO JavaDoc
   */
  public PayMoneyCard(
    String description,
    CardType type,
    double amount
  ) {
    super(description, type);
    this.amount = amount;
  }

}