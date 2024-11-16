package nl.hva.backend.services;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.dto.CreateGameRequest;
import nl.hva.backend.domain.dto.UpdateGameRequest;
import nl.hva.backend.domain.exceptions.PreConditionFailed;
import nl.hva.backend.domain.exceptions.ResourceNotFound;
import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;
import nl.hva.backend.repositories.GameActionRepository;
import nl.hva.backend.repositories.GameRepository;
import nl.hva.backend.repositories.LocationTrackerRepository;
import nl.hva.backend.repositories.PlayerRepository;
import nl.hva.backend.utils.SecurityContextHelper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Transactional
@Service
@RequiredArgsConstructor
public class GameService {

  private final GameRepository gameRepository;
  private final GameActionRepository gameActionRepository;
  private final GameBoardService gameBoardService;
  private final PlayerService playerService;
  private final PlayerRepository playerRepository;
  private final GameActionService gameActionService;
  private final LocationTrackerRepository locationTrackerRepo;

  public List<GameSession> getAllJoinable() {
    return gameRepository
      .findJoinAbleGames()
      .orElseGet(List::of);
  }

  public List<GameSession> getAllGamesOfCurrentUser() {
    var currentUser = SecurityContextHelper.getCurrentlyLoggedInUser();
    return gameRepository.findAllOf(currentUser.get()).orElseGet(List::of);
  }

  public GameSession getGameById(long id) {
    var game = gameRepository.findGameBy(id);
    if (game.isEmpty()) throw new ResourceNotFound("The requested game does not exist.");

    this.updateGameState(id);

    return game.get();
  }

  public GameSession updateGameById(UpdateGameRequest updateGameRequest, long gameId) {
    GameSession game = gameRepository.getById(gameId);

    if (game.getId() == null) {
      throw new ResourceNotFound("The requested game does not exist.");
    }

    game.setMaxTimeTurn(updateGameRequest.getMaxTimeTurn());
    game.setEndsAt(game.getEndsAt().plusHours(updateGameRequest.getMaxGameTime()));

    return this.gameRepository.save(game);
  }

  public GameSession create(@Valid CreateGameRequest req) {
    GameSession game = new GameSession();

    // Convert req to GameSession.
    game.setEndsAt(LocalDateTime.now().plusHours(req.getMaxGameTime()));
    game.setMaxPlayers(req.getMaxPlayers());
    game.setStartsAt(LocalDateTime.now().plusMinutes(req.getWaitingTime()));
    game.setMaxTimeTurn(req.getMaxTimeTurn());
    game.setState(GameSession.GameSessionState.JOINABLE);

    var selectedGameboard = gameBoardService.getDefaultGameBoard();
    game.setGameBoard(selectedGameboard);

    for (Location location : selectedGameboard.getLocations())
      if (location instanceof Property property) {
        var tracker = new Property.PropertyDevelopmentStageTracker(property);
        this.locationTrackerRepo.save(tracker);
        game.add(tracker);
      }

    // Persist created gameSession.
    game = gameRepository.save(game);

    return this.playerService.addPrincipalAsPlayerOf(game);
  }

  public GameSession joinBy(long gameId) {
    return this.playerService.addPrincipalAsPlayerOf(getGameById(gameId));
  }

  private void updateGameState(long gameId) {
    var game = this.gameRepository.getById(gameId);

    switch (game.getState()) {
      case JOINABLE -> {
        /* Starts the game when:
         * at least 2 players have joined and the start time has passed.
         * or the maximum amount of players have joined. */
        if (game.getPlayers().size() == game.getMaxPlayers()
          || LocalDateTime.now().isAfter(game.getStartsAt()) && game.getPlayers().size() >= 2
        ) this.gameActionService.startGame(gameId);
      }
      case STARTED -> {
        // Stop when the maximum time has passed.
        if (LocalDateTime.now().isAfter(game.getEndsAt())) this.gameActionService.forceGameCompletion(gameId);

        // Check if the turn of the player is over, if so punish by deducting 200$.
        this.gameActionService.checkIfTurnDurationExceededAndPunish(gameId);
      }
    }
  }

  public List<GameAction> getGameActionOfGameBy(Long id) {
    // Check if game exists and update game state;
    getGameById(id);

    return this.gameActionRepository.findGameActionsOf(id);
  }

  public List<GameAction> getGameActionsNewerThanGameAction(Long gameId, Long gameActionId) {
    // Check if game exists and update game state;
    getGameById(gameId);

    return this.gameActionRepository.findGameActionsOfGameNewerThan(gameId, gameActionId);
  }

  public List<Player> getPlayersForGame(long gameSessionId) {
    List<Player> allPlayers = this.playerRepository.findAll();
    List<Player> sessionPlayers = new ArrayList<>();

    for (Player allPlayer : allPlayers) {
      if (allPlayer.getGame().getId() == gameSessionId) {
        sessionPlayers.add(allPlayer);
      }
    }

    return sessionPlayers;
  }

  public void deletePlayerFrom(long playerId, long sessionId) {
    var game = gameRepository.getById(sessionId);
    if (!this.gameRepository.existsById(sessionId)) throw new ResourceNotFound("The requested game does not exist");

    if (game.getState().equals(GameSession.GameSessionState.COMPLETED))
      throw new PreConditionFailed("Cannot delete a player from completed game");

    List<Player> players = game.getPlayers();
    Optional<Player> currentPlayer = this.playerRepository.findById(playerId);
    if (currentPlayer.isEmpty()) throw new ResourceNotFound("Player does not exist.");

    players.remove(currentPlayer.get());
    game.setPlayers(players);
    this.gameRepository.save(game);

    if (players.isEmpty()) {
      gameRepository.deleteById(game.getId());
    }

    if (currentPlayer.get().isGameAdmin() && players.size() >= 1) {
      currentPlayer.get().setGameAdmin(false);
      players.get(players.size() - 1).setGameAdmin(true);
    }
    if (game.getState().equals(GameSession.GameSessionState.JOINABLE)) {
      if (game.getId() == 0) return;

      players.remove(currentPlayer.get());
      game.setPlayers(players);
      playerRepository.deleteById(currentPlayer.get().getId());
    } else {
      this.gameActionService.declarePlayerBankrupt(currentPlayer.get().getId());
    }

    for (Player player : players) {
      if (player.getTurnNumber() < currentPlayer.get().getTurnNumber()) continue;

      player.setTurnNumber(player.getTurnNumber() - 1);
      this.playerRepository.save(player);
    }

  }

}
