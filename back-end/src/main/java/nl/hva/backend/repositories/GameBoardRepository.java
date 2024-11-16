package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.game.board.GameBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;


@Repository
@Transactional
public interface GameBoardRepository extends JpaRepository<GameBoard, Long> {

  @Query("SELECT g FROM GameBoard g WHERE g.name = :name")
  Optional<GameBoard> findBy(@Param("name") String name);

}