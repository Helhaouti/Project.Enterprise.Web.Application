package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.game.action.GameAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface GameActionRepository extends JpaRepository<GameAction, Long> {

  @Query("SELECT a FROM GameAction a WHERE a.gameSession.id = :gameId ORDER BY a.id")
  List<GameAction> findGameActionsOf(
    @Param("gameId") Long gameId
  );

  @Query("SELECT a FROM GameAction a WHERE a.gameSession.id = :gameId AND a.id > :gameActionId ORDER BY a.id")
  List<GameAction> findGameActionsOfGameNewerThan(
    @Param("gameId") Long gameId,
    @Param("gameActionId") Long gameActionId
  );

}