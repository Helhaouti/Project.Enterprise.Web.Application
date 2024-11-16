package nl.hva.backend;

import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.repositories.GameBoardRepository;
import nl.hva.backend.services.GameBoardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import static org.junit.jupiter.api.Assertions.assertEquals;


@SpringBootTest(
  webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@TestMethodOrder(MethodOrderer.MethodName.class)
@TestInstance(value = TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext
public class GameBoardRepoTest {

  @Autowired
  private GameBoardRepository repo;

  @Autowired
  private GameBoardService service;

  private GameBoard defaultGameBoard;

  @BeforeEach
  public void setup() {
    defaultGameBoard = service.getDefaultGameBoard();
  }

  @Test
  public void T1_canRetrieveDefaultGameBoardByName() {
    // Arrange
    String defaultGameBoardName = defaultGameBoard.getName();

    // Act
    var queryResultForGameboard = repo.findBy(defaultGameBoardName);

    // Assert
    assertEquals(
      defaultGameBoard,
      queryResultForGameboard.get(),
      "The default gameboard cannot be found in the repository."
    );
  }

}