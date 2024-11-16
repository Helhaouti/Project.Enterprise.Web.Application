package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ChatRepository extends JpaRepository<Chat, Long> {

  @Query("SELECT e FROM Chat e WHERE e.gameId = :gameId")
  List<Chat> findAllChatsOf(@Param("gameId") long gameId);

}
