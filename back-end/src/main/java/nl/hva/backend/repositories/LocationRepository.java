package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.game.board.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;


public interface LocationRepository extends JpaRepository<Location, Long> {

}