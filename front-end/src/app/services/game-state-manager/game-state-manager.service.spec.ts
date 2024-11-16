import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {User} from "../../domain/models/user.model";
import {HttpHeaders, HttpResponse} from "@angular/common/http";
import {UserRole} from "../../domain/models/role.model";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AuthService} from "../authentication/auth.service";
import {GameStateManagerService} from "./game-state-manager.service";
import {GameSession, GameSessionState} from "../../domain/models/game/GameSession";
import {GameBoard} from "../../domain/models/game/board/GameBoard";
import {Player} from "../../domain/models/game/Player";
import {StartGameAction} from "../../domain/models/game/action/impl/gamePlay/StartGameAction";
import {SwitchPlayerAction} from "../../domain/models/game/action/impl/gamePlay/SwitchPlayerAction";

describe('GameStateManagerService', () => {
  let service: GameStateManagerService;
  let httpMock: HttpTestingController;

  const DUMMY_USER_1: User = new User(
    1,
    new Date(),
    new Date(),
    "test",
    "test@test.nl",
    [
      new UserRole(
        1,
        "player"
      )
    ],
    "fname",
    "lname",
    "NL"
  );
  const DUMMY_USER_2: User = new User(
    2,
    new Date(),
    new Date(),
    "test2",
    "test@test.nl",
    [
      new UserRole(
        1,
        "player"
      )
    ],
    "fname2",
    "lname2",
    "NL"
  );

  let dummyPlayer1: Player;
  let dummyPlayer2: Player;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule
      ]
    });

    service = TestBed.inject(GameStateManagerService);
    httpMock = TestBed.inject(HttpTestingController);

    // Create dummy players.
    dummyPlayer1 = new Player(
      1,
      DUMMY_USER_1,
      500,
      32,
      1,
      [],
      [],
      false,
      false,
      1,
      [],
      [],
      [],
      []
    );
    dummyPlayer2 = new Player(
      2,
      DUMMY_USER_2,
      500,
      2,
      2,
      [],
      [],
      false,
      false,
      2,
      [],
      [],
      [],
      []
    );

    // Setup authService for use with gameStateService.
    let authService = TestBed.inject(AuthService);

    const DUMMY_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiw"
      + "iaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const DUMMY_HTTP_RESPONSE: HttpResponse<User> = new HttpResponse<User>({
      body: DUMMY_USER_1,
      headers: new HttpHeaders(
        {"Authorization": `Bearer ${DUMMY_JWT}`}
      ),
      status: 200
    });

    authService.setSession(DUMMY_HTTP_RESPONSE);

    service.init(
      new GameSession(
        1,
        2,
        new Date(),
        1,
        new Date(new Date().setHours(new Date().getHours() + 2)),
        [
          dummyPlayer1,
          dummyPlayer2
        ],
        [],
        "me, the tester",
        GameSessionState.JOINABLE,
        new GameBoard(
          1,
          "Default US gameboard",
          [],
          []
        ),
        2,
        []
      )
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should set the state of the game to a fresh state upon StartGameAction', () => {
    // Arrange
    const FIRST_TURN_END: Date = new Date(new Date().setMinutes(new Date().getMinutes() + 2));
    const START_CAPITAL: number = 1500;

    const START_GAME_ACTION: StartGameAction = new StartGameAction(
      1,
      dummyPlayer1,
      new Date(),
      START_CAPITAL,
      FIRST_TURN_END,
    );

    // Act
    service.startGame(START_GAME_ACTION);

    // Assert
    let startedGame = service.getGameSnapshot();

    expect(startedGame.players[0].money).toEqual(START_CAPITAL);
    expect(startedGame.players[1].money).toEqual(START_CAPITAL);

    expect(startedGame.players[0].position).toEqual(1);
    expect(startedGame.players[1].position).toEqual(1);

    expect(startedGame.players[0].properties).toEqual([]);
    expect(startedGame.players[0].cards).toEqual([]);
    expect(startedGame.players[1].properties).toEqual([]);
    expect(startedGame.players[1].cards).toEqual([]);

    expect(startedGame.players[0].bankrupt).toBeFalsy();
    expect(startedGame.players[1].bankrupt).toBeFalsy();

    expect(startedGame.players[0].roundsInJail).toEqual(0);
    expect(startedGame.players[1].roundsInJail).toEqual(0);

    expect(startedGame.currentTurn).toEqual(1);
  });

  it('Should change the state after switch player action', () => {
    // Arrange
    const FIRST_TURN_END: Date = new Date(new Date().setMinutes(new Date().getMinutes() + 2));
    const SWITCH_PLAYER_ACTION: SwitchPlayerAction = new SwitchPlayerAction(
      1,
      dummyPlayer1,
      new Date(),
      dummyPlayer2,
      FIRST_TURN_END,
    );

    // Act
    service.procesSwitchPlayerAction(SWITCH_PLAYER_ACTION, false);

    // Assert
    let startedGame = service.getGameSnapshot();

    expect(startedGame.currentTurn).toEqual(2);
    expect(startedGame.players[1].roundsInJail).toEqual(2);
  });

});
