package nl.hva.backend.services;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.exceptions.ConflictException;
import nl.hva.backend.domain.exceptions.PreConditionFailed;
import nl.hva.backend.domain.exceptions.ResourceNotFound;
import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.user.User;
import nl.hva.backend.repositories.GameRepository;
import nl.hva.backend.repositories.PlayerRepository;
import nl.hva.backend.utils.SecurityContextHelper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
@Transactional
@RequiredArgsConstructor
public class PlayerService {

  private final PlayerRepository repo;
  private final GameRepository gameRepository;

  public Optional<Player> getOwnerOf(long gameId, long locationId) {
    if (!this.gameRepository.existsById(gameId))
      throw new ResourceNotFound("The requested game does not exist.");
    var game = this.gameRepository.getById(gameId);

    if (game.getPlayers() == null
      || game.getPlayers().size() == 0
    ) return Optional.empty();

    return game.getPlayers()
      .stream()
      .filter(player -> player.getProperties() != null
        && player.getProperties()
        .stream()
        .anyMatch(ownableLocation -> ownableLocation.getId() == locationId)
      )
      .findFirst();
  }

  public GameSession addPrincipalAsPlayerOf(GameSession game) {
    // Validation.
    if (game.getState() == GameSession.GameSessionState.STARTED
      || game.getState() == GameSession.GameSessionState.COMPLETED)
      throw new PreConditionFailed("Game is no longer joinable.");

    if (game.getPlayers() != null && game.getPlayers().size() >= game.getMaxPlayers())
      throw new PreConditionFailed("Game is no longer joinable. The game already is at its maximum of players.");

    var currentUser = SecurityContextHelper.getCurrentlyLoggedInUser();
    var currentPlayer = this.repo.findBy(game, currentUser.get());

    if (currentPlayer.isPresent()) throw new ConflictException("User already joined the game.");

    // Create and add player to game, from user that is currently logged in.
    var createdPlayer = createPlayerFor(
      currentUser.get(),
      game,
      (game.getPlayers() == null || game.getPlayers().size() == 0));

    game.add(createdPlayer);

    return this.gameRepository.save(game);
  }

  private Player createPlayerFor(User user, GameSession game, boolean isAdmin) {
    var player = new Player();

    player.setGame(game);
    player.setGameAdmin(isAdmin);
    player.setUser(user);

    player.setTurnNumber(Objects.requireNonNullElse(game.getPlayers(), List.of()).size() + 1);

    return this.repo.save(player);
  }

}