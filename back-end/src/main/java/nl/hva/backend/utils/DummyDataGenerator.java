package nl.hva.backend.utils;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.dto.user.CreateUserRequest;
import nl.hva.backend.domain.models.CountryCode;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.board.location.locationImpl.BoardCorner;
import nl.hva.backend.domain.models.game.board.location.locationImpl.PickCardLocation;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;
import nl.hva.backend.domain.models.game.board.location.locationImpl.RailRoad;
import nl.hva.backend.domain.models.game.board.location.locationImpl.TaxLocation;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Utility;
import nl.hva.backend.domain.models.game.card.Card;
import nl.hva.backend.domain.models.game.card.impl.FreeMoneyCard;
import nl.hva.backend.domain.models.game.card.impl.GoToJailCard;
import nl.hva.backend.domain.models.game.card.impl.MoveTokenToPositionCard;
import nl.hva.backend.domain.models.game.card.impl.PayMoneyCard;
import nl.hva.backend.services.UserService;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@RequiredArgsConstructor
public class DummyDataGenerator {

  private final UserService userService;

  public void createTestPlayers() {
    userService.create(
      new CreateUserRequest(
        "Standard user",
        "of UserVille",
        "test",
        "test",
        "test@test.nl",
        CountryCode.valueOf("NL")
      )
    );
    userService.create(
      new CreateUserRequest(
        "Standard user",
        "of UserVille",
        "test2",
        "test",
        "test@test.nl",
        CountryCode.valueOf("NL")
      )
    );
    userService.create(
      new CreateUserRequest(
        "Standard user",
        "of UserVille",
        "test3",
        "test",
        "test@test.nl",
        CountryCode.valueOf("NL")
      )
    );
    userService.create(
      new CreateUserRequest(
        "Standard user",
        "of UserVille",
        "test4",
        "test",
        "test@test.nl",
        CountryCode.valueOf("NL")
      )
    );
  }

  public static GameBoard getDefaultGameBoard() {
    return new GameBoard("Standard US gameboard");
  }

  public static List<Location> getDefaultGameBoardLocations() {
    return List.of(
      new BoardCorner(
        0,
        1,
        "Collect $200.00 salary as you pass",
        null,
        BoardCorner.BoardCornerType.GO
      ),

      new Property(
        0,
        2,
        "",
        null,
        50,
        Property.PropertyColor.DARK_PURPLE,
        "Mediter-ranean Avenue",
        50,
        2,
        10,
        30,
        90,
        160,
        250
      ),
      new PickCardLocation(
        0,
        3,
        "",
        null,
        Card.CardType.CHEST

      ),
      new Property(
        0,
        4,
        "",
        null,
        50,
        Property.PropertyColor.DARK_PURPLE,
        "Baltic Avenue",
        50,
        4,
        20,
        60,
        180,
        320,
        450
      ),
      new TaxLocation(
        0,
        5,
        "",
        null,
        "Income tax",
        200
      ),
      new RailRoad(
        0,
        6,
        "",
        null,
        200,
        "Reading Railroad",
        25,
        50,
        100,
        200
      ),
      new Property(
        0,
        7,
        "",
        null,
        100,
        Property.PropertyColor.LIGHT_BLUE,
        "Oriental Avenue",
        50,

        6,
        30,
        90,
        270,
        400,
        550
      ),
      new PickCardLocation(
        0,
        8,
        "",
        null,
        Card.CardType.CHANCE
      ),
      new Property(
        0,
        9,
        "",
        null,
        100,
        Property.PropertyColor.LIGHT_BLUE,
        "Vermont Avenue",
        50,
        6,
        30,
        90,
        270,
        400,
        550
      ),
      new Property(
        0,
        10,
        "",
        null,
        120,
        Property.PropertyColor.LIGHT_BLUE,
        "Connecticut Avenue",
        50,
        8,
        40,
        100,
        300,
        450,
        600
      ),


      new BoardCorner(
        0,
        11,
        "",
        null,
        BoardCorner.BoardCornerType.JAIL
      ),

      new Property(
        0,
        12,
        "",
        null,
        140,
        Property.PropertyColor.PURPLE,
        "St. Charles Place",
        100,
        10,
        50,
        150,
        450,
        625,
        750
      ),
      new Utility(
        0,
        13,
        "",
        null,
        150,
        "Electric Company",
        4,
        10),
      new Property(
        0,
        14,
        "",
        null,
        140,
        Property.PropertyColor.PURPLE,
        "States Avenue",
        100,
        10,
        50,
        150,
        450,
        625,
        750
      ),
      new Property(
        0,
        15,
        "",
        null,
        140,
        Property.PropertyColor.PURPLE,
        "Virginia Avenue",
        100,
        12,
        60,
        80,
        500,
        700,
        900
      ),
      new RailRoad(
        0,
        16,
        "",
        null,
        200,
        "Pennsylvania Railroad",
        25,
        50,
        100,
        200
      ),
      new Property(
        0,
        17,
        "",
        null,
        160,
        Property.PropertyColor.ORANGE,
        "St. James Avenue",
        100,
        14,
        70,
        200,
        550,
        750,
        950
      ),
      new PickCardLocation(
        0,
        18,
        "",
        null,
        Card.CardType.CHEST
      ),
      new Property(
        0,
        19,
        "",
        null,
        180,
        Property.PropertyColor.ORANGE,
        "Tennessee Avenue",
        100,
        14,
        70,
        200,
        550,
        750,
        950
      ),
      new Property(
        0,
        20,
        "",
        null,
        140,
        Property.PropertyColor.ORANGE,
        "New York Avenue",
        100,
        16,
        80,
        220,
        600,
        800,
        1000
      ),

      new BoardCorner(
        0,
        21,
        "",
        null,
        BoardCorner.BoardCornerType.FREE_PARKING
      ),

      new Property(
        0,
        22,
        "",
        null,
        220,
        Property.PropertyColor.RED,
        "Kentucky Avenue",
        150,
        18,
        90,
        250,
        700,
        875,
        1050
      ),
      new PickCardLocation(
        0,
        23,
        "",
        null,
        Card.CardType.CHANCE
      ),
      new Property(
        0,
        24,
        "",
        null,
        220,
        Property.PropertyColor.RED,
        "Indiana Avenue",
        150,
        18,
        90,
        250,
        700,
        875,
        1050
      ),
      new Property(
        0,
        25,
        "",
        null,
        200, Property.PropertyColor.RED,
        "Illinois Avenue",
        150,
        20,
        100,
        300,
        750,
        925,
        1100
      ),
      new RailRoad(
        0,
        26,
        "",
        null,
        200,
        "B & O Railroad",
        25,
        50,
        100,
        200
      ),
      new Property(
        0,
        27,
        "",
        null,
        260,
        Property.PropertyColor.YELLOW,
        "Atlantic Avenue",
        150,
        22,
        110,
        330,
        800,
        975,
        1150
      ),
      new Property(
        0,
        28,
        "",
        null,
        260,
        Property.PropertyColor.YELLOW,
        "Ventnor Avenue",
        150,
        22,
        110,
        330,
        800,
        975,
        1150
      ),
      new Utility(
        0,
        29,
        "",
        null,
        200,
        "Waterworks",
        4,
        10),
      new Property(
        0,
        30,
        "",
        null,
        280,
        Property.PropertyColor.YELLOW,
        "Marvin Gardens",
        150,
        24,
        120,
        360,
        850,
        1025,
        1200
      ),

      new BoardCorner(
        0,
        31,
        "",
        null,
        BoardCorner.BoardCornerType.GO_TO_JAIL
      ),

      new Property(
        0,
        32,
        "",
        null,
        300,
        Property.PropertyColor.GREEN,
        "Pacific Avenue",
        200,
        26,
        130,
        390,
        900,
        1100,
        1275
      ),
      new Property(
        0,
        33,
        "",
        null,
        300,
        Property.PropertyColor.GREEN,
        "North Carolina Avenue",
        200,
        26,
        130,
        390,
        900,
        1100,
        1275
      ),
      new PickCardLocation(
        0,
        34,
        "",
        null,
        Card.CardType.CHEST
      ),
      new Property(
        0,
        35,
        "",
        null,
        320,
        Property.PropertyColor.GREEN,
        "Pennsylvania Avenue",
        200,
        28,
        150,
        450,
        1000,
        1200,
        1400
      ),
      new RailRoad(
        0,
        36,
        "",
        null,
        200,
        "Short Line",
        25,
        50,
        100,
        200
      ),
      new PickCardLocation(
        0,
        37,
        "",
        null,
        Card.CardType.CHANCE
      ),
      new Property(
        0,
        38,
        "",
        null,
        350,
        Property.PropertyColor.DARK_BLUE,
        "Park Place",
        200,
        35,
        175,
        500,
        1100,
        1300,
        1500
      ),
      new TaxLocation(
        0,
        39,
        "",
        null,
        "Luxury tax",
        100
      ),
      new Property(
        0,
        40,
        "",
        null,
        400,
        Property.PropertyColor.DARK_BLUE,
        "Boardwalk",
        200,
        50,
        200,
        600,
        1400,
        1700,
        2000
      )
    );
  }

  public static List<Card> getDefaultCardDeck() {
    return List.of(
      new MoveTokenToPositionCard(
        "Advance to Go (Collect $200)",
        Card.CardType.CHEST,
        1
      ),
      new MoveTokenToPositionCard(
        "Advance to Illinois Avenue. If you pass Go, collect $200",
        Card.CardType.CHANCE,
        25
      ),
      new MoveTokenToPositionCard(
        "Advance to St. Charles Place. If you pass Go, collect $200",
        Card.CardType.CHANCE,
        12
      ),
      new MoveTokenToPositionCard(
        "Advance to Boardwalk",
        Card.CardType.CHANCE,
        40
      ),
      new MoveTokenToPositionCard(
        "Advance to Go (Collect $200)",
        Card.CardType.CHANCE,
        1
      ),
      new MoveTokenToPositionCard(
        "Take a trip to Reading Railroad. If you pass Go, collect $200",
        Card.CardType.CHANCE,
        6
      ),
      new PayMoneyCard(
        "Doctor’s fee. Pay $50",
        Card.CardType.CHEST,
        50
      ),
      new PayMoneyCard(
        "Pay hospital fees of $100",
        Card.CardType.CHEST,
        100
      ),
      new PayMoneyCard(
        "Pay school fees of $50",
        Card.CardType.CHEST,
        50
      ),
      new PayMoneyCard(
        "You forget to pay your bill, the collectors require you to pay: $569",
        Card.CardType.CHEST,
        569
      ),
      new PayMoneyCard(
        "Speeding fine $15",
        Card.CardType.CHANCE,
        15
      ),
      new GoToJailCard(
        "Go to Jail. Go directly to jail, do not pass Go, do not collect $200",
        Card.CardType.CHEST,
        true
      ),
      new GoToJailCard(
        "Go to Jail. Go directly to jail, do not pass Go, do not collect $200",
        Card.CardType.CHANCE,
        true
      ),
      new FreeMoneyCard(
        "Bank error in your favor. Collect $200",
        Card.CardType.CHEST,
        200
      ),
      new FreeMoneyCard(
        "From sale of stock you get $50",
        Card.CardType.CHEST,
        50
      ),
      new FreeMoneyCard(
        "Holiday fund matures. Receive $100",
        Card.CardType.CHEST,
        100
      ),
      new FreeMoneyCard(
        "Income tax refund. Collect $20",
        Card.CardType.CHEST,
        20
      ),
      new FreeMoneyCard(
        "Life insurance matures. Collect $100",
        Card.CardType.CHEST,
        100
      ),
      new FreeMoneyCard(
        "Receive $25 consultancy fee",
        Card.CardType.CHEST,
        25
      ),
      new FreeMoneyCard(
        "You have won second prize in a beauty contest. Collect $10",
        Card.CardType.CHEST,
        10
      ),
      new FreeMoneyCard(
        "You inherit $100",
        Card.CardType.CHEST,
        100
      ),
      new FreeMoneyCard(
        "Bank pays you dividend of $50",
        Card.CardType.CHEST,
        50
      ),
      new FreeMoneyCard(
        "Your building loan matures. Collect $150",
        Card.CardType.CHEST,
        150
      )
    );
  }

}