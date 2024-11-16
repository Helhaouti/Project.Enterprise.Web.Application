package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;


@Transactional
@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

  @Query("SELECT p FROM Player p WHERE p.game = :game AND p.user = :user")
  Optional<Player> findBy(@Param("game") GameSession game, @Param("user") User user);

  @Query("SELECT p FROM Player p WHERE p.game = :game AND p.turnNumber = :turn")
  Optional<Player> findBy(@Param("game") GameSession game, @Param("turn") int turn);

}