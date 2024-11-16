package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.game.card.Card;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CardRepository extends JpaRepository<Card, Long> {

}
