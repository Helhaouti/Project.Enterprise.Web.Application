package nl.hva.backend;

import nl.hva.backend.domain.dto.CreateGameRequest;
import nl.hva.backend.domain.dto.user.LogInRequest;
import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.user.User;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiPredicate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


/**
 * Unit tests designed to test aspects of gameplay. These unit tests should be executed sequentially.
 *
 * @author Hamza el Haouti
 */
@SpringBootTest(
  webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@TestMethodOrder(MethodOrderer.MethodName.class)
@TestInstance(value = TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext
public class GamePlayTest {

  static final String AUTHENTICATION_API_BASE = "/api/authenticate";
  static final String LOGIN_API = "/login";

  static final String GAME_API_BASE = "/api/game";
  static final String CREATE_GAME_ENDPOINT = "/create";
  static final String JOIN_GAME_ENDPOINT = "/join";

  static Map<User, String> usersAndJwtokens = new HashMap<>();

  /**
   * Value in minutes.
   * <p>
   * Intended for values, that differ slightly because of latency introduced by the network stack.
   */
  final static int ACCEPTABLE_DELTA_FOR_LATENCY_DEPENDENT_INFORMATION = 2;

  /**
   * The maximum amount of game members before a game starts.
   * <p>
   * NOTE: Do not change value, tests do not scale automatically.
   */
  final static int DEFAULT_MAX_GAME_MEMBERS = 3;

  final static BiPredicate<Player, User> IS_USER_PLAYER_DETERMINATOR = (p, u) -> p.getUser().equals(u);

  @Autowired
  TestRestTemplate restTemplate;

  GameSession createdGame;

  @BeforeAll
  void setup() {
    // Arrange
    final var LOGIN_ENDPOINT = AUTHENTICATION_API_BASE + LOGIN_API;

    for (int i = 1; i <= 3; i++) {
      // Arrange
      String userNameSuffix = i > 1 ? String.valueOf(i) : "";

      // Act
      var logInResponse = this.restTemplate.postForEntity(
        LOGIN_ENDPOINT,
        new LogInRequest(
          "test" + userNameSuffix,
          "test"
        ),
        User.class
      );

      // Assert
      assertEquals(
        logInResponse.getStatusCode(),
        HttpStatus.ACCEPTED,
        "The default test user account could not be used to log in."
      );

      var token = logInResponse
        .getHeaders()
        .get(HttpHeaders.AUTHORIZATION)
        .get(0)
        .trim();

      GamePlayTest.usersAndJwtokens.put(
        logInResponse.getBody(),
        token
      );
    }

  }

  @Test
  public void T1_userCanCreateAGame() {
    // Arrange
    final var CREATE_GAME_ENDPOINT = GAME_API_BASE + GamePlayTest.CREATE_GAME_ENDPOINT;

    final var GAME_CREATOR = new User(1);
    final var TOKEN_OF_GAME_CREATOR = usersAndJwtokens.get(GAME_CREATOR);

    final var CREATE_GAME_REQUEST = new CreateGameRequest(
      DEFAULT_MAX_GAME_MEMBERS,
      5,
      1,
      2
    );

    // Act: Perform a request.
    var createGameResponse = this.restTemplate
      .exchange(
        CREATE_GAME_ENDPOINT,
        HttpMethod.POST,
        new HttpEntity<>(
          CREATE_GAME_REQUEST,
          new HttpHeaders() {{
            set(HttpHeaders.AUTHORIZATION, TOKEN_OF_GAME_CREATOR);
          }}
        ),
        GameSession.class
      );


    var receivedResponseAt = LocalDateTime.now();

    // Assert: That the response is correct.
    assertEquals(
      HttpStatus.CREATED,
      createGameResponse.getStatusCode(),
      "The game could not be created."
    );

    createdGame = createGameResponse.getBody();

    assertEquals(
      CREATE_GAME_REQUEST.getMaxTimeTurn(),
      createdGame.getMaxTimeTurn(),
      "The game does not have the right turn duration limits."
    );
    assertEquals(
      CREATE_GAME_REQUEST.getMaxPlayers(),
      createdGame.getMaxPlayers(),
      "The game does not have the right maximum amount of players."
    );
    assertEquals(
      CREATE_GAME_REQUEST.getWaitingTime(),
      ChronoUnit.MINUTES.between(
        receivedResponseAt,
        createdGame.getStartsAt()
      ),
      ACCEPTABLE_DELTA_FOR_LATENCY_DEPENDENT_INFORMATION,
      "The game does not have the right start time."
    );
    assertEquals(
      CREATE_GAME_REQUEST.getMaxGameTime() * 60,
      ChronoUnit.MINUTES.between(
        receivedResponseAt,
        createdGame.getEndsAt()
      ),
      ACCEPTABLE_DELTA_FOR_LATENCY_DEPENDENT_INFORMATION,
      "The game does not have the right end time."
    );
    assertEquals(
      GameSession.GameSessionState.JOINABLE,
      createdGame.getState(),
      "The game does not have the right game state."
    );
    assertEquals(
      1,
      createdGame.getPlayers().size(),
      "The player contains more or less players than 1"
    );
    assertTrue(
      createdGame.getPlayers()
        .stream()
        .anyMatch(p -> IS_USER_PLAYER_DETERMINATOR.test(p, GAME_CREATOR)),
      "Game creator has not been added to the player list."
    );
  }

  @Test
  public void T2_aUserCanJoinAGame() {
    // Arrange
    final var JOIN_GAME_ENDPOINT = GAME_API_BASE + "/" + createdGame.getId() + GamePlayTest.JOIN_GAME_ENDPOINT;

    final var GAME_CREATOR = new User(1);
    final var DUMMY_GAME_PARTICIPANT_2 = new User(2);

    final var TOKEN_OF_DUMMY_GAME_PARTICIPANT_2 = usersAndJwtokens.get(DUMMY_GAME_PARTICIPANT_2);

    // Act: Perform a request to join a game.
    var joinedGameResponse = this.restTemplate.exchange(
      JOIN_GAME_ENDPOINT,
      HttpMethod.POST,
      new HttpEntity<>(
        new HttpHeaders() {{
          set(HttpHeaders.AUTHORIZATION, TOKEN_OF_DUMMY_GAME_PARTICIPANT_2);
        }}
      ),
      GameSession.class
    );

    // Assert
    assertEquals(
      HttpStatus.ACCEPTED,
      joinedGameResponse.getStatusCode(),
      "The user could not join the game."
    );

    var joinedGame = joinedGameResponse.getBody();

    assertEquals(
      GameSession.GameSessionState.JOINABLE,
      joinedGame.getState(),
      "The game is no longer join-able."
    );

    assertEquals(
      2,
      joinedGame.getPlayers().size(),
      "The player contains more or less players than 1"
    );
    assertTrue(
      joinedGame.getPlayers()
        .stream()
        .anyMatch(p -> IS_USER_PLAYER_DETERMINATOR.test(p, GAME_CREATOR))
        && joinedGame.getPlayers()
        .stream()
        .anyMatch(p -> IS_USER_PLAYER_DETERMINATOR.test(p, DUMMY_GAME_PARTICIPANT_2)),
      "Game creator and/or new participant have not been added to the player list."
    );

  }

  @Test
  public void T3_aUserCannotJoinAGameTwice() {
    // Arrange
    final var JOIN_GAME_ENDPOINT = GAME_API_BASE + "/" + createdGame.getId() + GamePlayTest.JOIN_GAME_ENDPOINT;
    final var DUMMY_GAME_PARTICIPANT = new User(1);
    final var TOKEN_OF_DUMMY_GAME_PARTICIPANT = usersAndJwtokens.get(DUMMY_GAME_PARTICIPANT);

    // Act: Perform a request to join a game.
    var joinedGameResponse = this.restTemplate.exchange(
      JOIN_GAME_ENDPOINT,
      HttpMethod.POST,
      new HttpEntity<>(
        new HttpHeaders() {{
          set(HttpHeaders.AUTHORIZATION, TOKEN_OF_DUMMY_GAME_PARTICIPANT);
        }}
      ),
      String.class
    );

    // Assert
    assertEquals(
      HttpStatus.CONFLICT,
      joinedGameResponse.getStatusCode(),
      "A player could join the game twice."
    );
  }

  @Test
  public void T4_gameStartsWhenEnoughPeopleHaveJoined() {
    // Arrange
    final var DUMMY_GAME_CREATOR = new User(1);
    final var DUMMY_GAME_PARTICIPANT_2 = new User(2);
    final var DUMMY_GAME_PARTICIPANT_3 = new User(3);

    final var TOKEN_OF_DUMMY_GAME_PARTICIPANT_3 = usersAndJwtokens.get(DUMMY_GAME_PARTICIPANT_3);
    final var JOIN_GAME_ENDPOINT = GAME_API_BASE + "/" + createdGame.getId() + GamePlayTest.JOIN_GAME_ENDPOINT;

    // Act: Perform a request to join a game.
    var joinedGameResponse = this.restTemplate.exchange(
      JOIN_GAME_ENDPOINT,
      HttpMethod.POST,
      new HttpEntity<>(
        new HttpHeaders() {{
          set(HttpHeaders.AUTHORIZATION, TOKEN_OF_DUMMY_GAME_PARTICIPANT_3);
        }}
      ),
      GameSession.class
    );

    // Assert
    assertEquals(
      HttpStatus.ACCEPTED,
      joinedGameResponse.getStatusCode(),
      "The user could not join the game."
    );

    var joinedGame = joinedGameResponse.getBody();

    assertEquals(
      GameSession.GameSessionState.STARTED,
      joinedGame.getState(),
      "The game has not started."
    );
    assertEquals(
      3,
      joinedGame.getPlayers().size(),
      "The player contains more or less players than 1"
    );
    assertTrue(
      joinedGame.getPlayers()
        .stream()
        .anyMatch(p -> IS_USER_PLAYER_DETERMINATOR.test(p, DUMMY_GAME_CREATOR))
        && joinedGame.getPlayers()
        .stream()
        .anyMatch(p -> IS_USER_PLAYER_DETERMINATOR.test(p, DUMMY_GAME_PARTICIPANT_2))
        && joinedGame.getPlayers()
        .stream()
        .anyMatch(p -> IS_USER_PLAYER_DETERMINATOR.test(p, DUMMY_GAME_PARTICIPANT_3)),
      "Game creator and/or new participant have not been added to the player list."
    );
  }

}