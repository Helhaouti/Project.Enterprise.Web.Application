package nl.hva.backend.services;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.exceptions.ResourceNotFound;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.card.Card;
import nl.hva.backend.repositories.CardRepository;
import nl.hva.backend.repositories.GameBoardRepository;
import nl.hva.backend.repositories.LocationRepository;
import nl.hva.backend.utils.DummyDataGenerator;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;


@Transactional
@Service
@RequiredArgsConstructor
public class GameBoardService {

  private final GameBoardRepository gameBoardRepo;
  private final LocationRepository locationRepo;
  private final CardRepository cardRepo;

  public GameBoard getDefaultGameBoard() {
    var defaultBoard = DummyDataGenerator.getDefaultGameBoard();
    var savedBoard = gameBoardRepo.findBy(defaultBoard.getName());

    return savedBoard
      .orElseGet(
        () -> this.create(
          defaultBoard,
          DummyDataGenerator.getDefaultGameBoardLocations(),
          DummyDataGenerator.getDefaultCardDeck()
        )
      );
  }

  public GameBoard create(
    GameBoard board,
    List<Location> locations,
    List<Card> cards
  ) {
    this.gameBoardRepo.save(board);

    return this.addToGameBoard(board.getId(), locations, cards);
  }

  private GameBoard addToGameBoard(
    long boardId,
    List<Location> locations,
    List<Card> cards
  ) {
    if (!gameBoardRepo.existsById(boardId))
      throw new ResourceNotFound("The requested game board does not exist.");

    GameBoard board = gameBoardRepo.getById(boardId);

    for (Location location : locations) {
      location.setGameBoard(board);
      this.locationRepo.save(location);
      board.add(location);
    }

    for (Card card : cards) {
      card.setGameBoard(board);
      this.cardRepo.save(card);
      board.add(card);
    }

    return board;
  }

}