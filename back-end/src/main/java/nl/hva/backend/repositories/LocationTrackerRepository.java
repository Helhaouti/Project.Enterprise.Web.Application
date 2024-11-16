package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;
import org.springframework.data.jpa.repository.JpaRepository;


public interface LocationTrackerRepository extends JpaRepository<Property.PropertyDevelopmentStageTracker, Long> {

}
