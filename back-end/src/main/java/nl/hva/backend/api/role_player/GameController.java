package nl.hva.backend.api.role_player;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.dto.CreateGameRequest;
import nl.hva.backend.domain.dto.UpdateGameRequest;
import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.services.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;


/**
 * @author Hamza el Haouti
 */
@RestController
@RequestMapping("api/game")
@RequiredArgsConstructor
public class GameController {

  private final GameService gameService;

  @GetMapping()
  public List<GameSession> getAllJoinableGames() {
    return gameService.getAllJoinable();
  }

  @GetMapping("/history")
  public List<GameSession> getGameHistory() {
    return gameService.getAllGamesOfCurrentUser();
  }

  @GetMapping(path = "/{id}")
  public GameSession retrieveGame(@PathVariable long id) {
    return gameService.getGameById(id);
  }

  @PostMapping("{gameId}/join")
  public ResponseEntity<GameSession> joinGame(@PathVariable String gameId) {
    var game = gameService.joinBy(Long.parseLong(gameId));

    return ResponseEntity.accepted().body(game);
  }

  @GetMapping(path = "/{sessionId}/players")
  public ResponseEntity<List<Player>> GetPlayersForSession(@PathVariable String sessionId) {
    var players = this.gameService.getPlayersForGame(Long.parseLong(sessionId));

    return ResponseEntity.accepted().body(players);
  }

  @PostMapping(path = "/create")
  public ResponseEntity<GameSession> postEvent(@RequestBody @Valid CreateGameRequest req) {
    var game = gameService.create(req);

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(game.getId())
      .toUri();

    return ResponseEntity.created(location).body(game);
  }

  @PutMapping(path = "/{sessionId}/update")
  public ResponseEntity<GameSession> updateGameSession(
    @RequestBody @Valid UpdateGameRequest request,
    @PathVariable int sessionId
  ) {
    var game = gameService.updateGameById(request, sessionId);

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(game.getId())
      .toUri();
    return ResponseEntity.created(location).body(game);
  }

  @PostMapping(path = "/{sessionId}/leave/{playerId}")
  public ResponseEntity<Object> LeaveGameSession(@PathVariable int sessionId, @PathVariable int playerId) {
    gameService.deletePlayerFrom(playerId, sessionId);

    return ResponseEntity.ok().build();
  }

}