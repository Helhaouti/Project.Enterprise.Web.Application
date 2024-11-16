package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface GameRepository extends JpaRepository<GameSession, Long> {

  @Query("SELECT g FROM GameSession g WHERE g.id = :id")
  Optional<GameSession> findGameBy(@Param("id") Long id);

  @Query("SELECT g FROM GameSession g WHERE g.state = 'JOINABLE'")
  Optional<List<GameSession>> findJoinAbleGames();

  @Query("SELECT p.game from Player p WHERE p.user = :user")
  Optional<List<GameSession>> findAllOf(@Param("user") User user);

}
