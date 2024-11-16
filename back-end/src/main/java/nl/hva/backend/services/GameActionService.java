package nl.hva.backend.services;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.exceptions.BadRequest;
import nl.hva.backend.domain.exceptions.ConflictException;
import nl.hva.backend.domain.exceptions.PreConditionFailed;
import nl.hva.backend.domain.exceptions.ResourceNotFound;
import nl.hva.backend.domain.exceptions.UnauthorizedException;
import nl.hva.backend.domain.models.game.GameAsset;
import nl.hva.backend.domain.models.game.GameSession;
import nl.hva.backend.domain.models.game.Player;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.action.impl.card.CardUsageAction;
import nl.hva.backend.domain.models.game.action.impl.card.DrawCardAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.DeclareBankruptcyAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.DiceRollAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.PassGoAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.PlayerMoveAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.StartGameAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.SwitchPlayerAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.WinGameAction;
import nl.hva.backend.domain.models.game.action.impl.jail.FreeFromJailAction;
import nl.hva.backend.domain.models.game.action.impl.jail.GoToJailAction;
import nl.hva.backend.domain.models.game.action.impl.money.MoneyExchangeAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.DebtForeclosureAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.PayTaxAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.PropertyDevelopmentAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.ReceiveFreeMoneyAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.RentCollectionAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.SkipTurnTaxAction;
import nl.hva.backend.domain.models.game.action.impl.property.LocationBidAction;
import nl.hva.backend.domain.models.game.action.impl.property.LocationPurchaseAction;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.board.location.OwnableLocation;
import nl.hva.backend.domain.models.game.board.location.locationImpl.BoardCorner;
import nl.hva.backend.domain.models.game.board.location.locationImpl.PickCardLocation;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;
import nl.hva.backend.domain.models.game.board.location.locationImpl.RailRoad;
import nl.hva.backend.domain.models.game.board.location.locationImpl.TaxLocation;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Utility;
import nl.hva.backend.domain.models.game.card.Card;
import nl.hva.backend.domain.models.game.card.impl.FreeMoneyCard;
import nl.hva.backend.domain.models.game.card.impl.GoToJailCard;
import nl.hva.backend.domain.models.game.card.impl.JailBreakCard;
import nl.hva.backend.domain.models.game.card.impl.MoveTokenCard;
import nl.hva.backend.domain.models.game.card.impl.MoveTokenToPositionCard;
import nl.hva.backend.domain.models.game.card.impl.PayMoneyCard;
import nl.hva.backend.repositories.GameActionRepository;
import nl.hva.backend.repositories.GameRepository;
import nl.hva.backend.repositories.LocationRepository;
import nl.hva.backend.repositories.PlayerRepository;
import nl.hva.backend.utils.SecurityContextHelper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;


/**
 * A service to perform operations on GameActions.
 *
 * @author Hamza el Haouti, Hidde Balestra
 */
@Service
@Transactional
@RequiredArgsConstructor
public class GameActionService {

  private final Random random = new Random();
  private final PlayerService playerService;
  private final GameActionRepository gameActionRepository;
  private final PlayerRepository playerRepository;
  private final GameRepository gameRepository;
  private final LocationRepository locationRepository;

  //region state related methods

  public void startGame(long gameId) {
    final int START_CAPITAL = 1500;

    if (!this.gameRepository.existsById(gameId)) throw new ResourceNotFound("The requested game does not exist.");

    var game = gameRepository.getById(gameId);
    var firstTurnEndsAt = LocalDateTime.now().plusMinutes(game.getMaxTimeTurn());
    var playerWithFirstRound = game.getPlayers().stream()
      .filter(player -> player.getTurnNumber() == 1)
      .findFirst()
      .get();

    this.saveActions(gameId, List.of(
      new StartGameAction(playerWithFirstRound, START_CAPITAL, firstTurnEndsAt))
    );

    game.setState(GameSession.GameSessionState.STARTED);
    game.setStartedAt(LocalDateTime.now());

    for (Player player : game.getPlayers()) {
      player.setMoney(START_CAPITAL);
      this.playerRepository.save(player);
    }
  }

  public void forceGameCompletion(long gameId) {
    var game = this.gameRepository.findGameBy(gameId)
      .orElseThrow(() -> new ResourceNotFound("The requested game does not exist."));

    if (game.getState().equals(GameSession.GameSessionState.COMPLETED))
      throw new PreConditionFailed("Only a game that is finished can be stopped.");

    var highestRankingPlayerId = game
      .getPlayers()
      .stream()
      .filter(Player.IS_PLAYER_BANKRUPT_PREDICATE.negate())
      .max(Player::compareRankTo)
      // Omitted empty check, because every active GameSession needs to contain at least 2 non-bankrupt players.
      .get().getId();

    this.makePlayerByIdWin(highestRankingPlayerId);
  }

  private void makePlayerByIdWin(long playerId) {
    var player = this.playerRepository.getById(playerId);
    var game = this.gameRepository.getById(player.getGame().getId());

    game.setState(GameSession.GameSessionState.COMPLETED);

    saveActions(game.getId(), List.of(new WinGameAction(player)));
  }

  public void declarePlayerBankrupt(long playerId) {
    if (!this.playerRepository.existsById(playerId))
      throw new ResourceNotFound("The requested player does not exist.");

    var player = this.playerRepository.getById(playerId);

    player.setBankrupt(true);

    List<GameAsset.GameAssetBid> removedBids = Stream.of(
        player.getPerformedLocationBids(),
        player.getReceivedLocationBids(),
        player.getPerformedJailBreakCardBids(),
        player.getReceivedLocationBids()
      )
      .flatMap(Collection::stream)
      .collect(Collectors.toCollection(ArrayList::new));

    this.saveActions(
      player.getGame().getId(),
      List.of(
        new DeclareBankruptcyAction(
          player,
          removedBids,
          new ArrayList<>(Objects.requireNonNullElse(player.getProperties(), List.of())),
          new ArrayList<>(Objects.requireNonNullElse(player.getCards(), List.of())),
          player.getMoney(),
          player.getPosition()
        )
      )
    );

    this.removeActivityOf(playerId);
    this.checkIfGameIsCompleted(player.getGame().getId());
  }

  private void checkIfGameIsCompleted(long gameId) {
    var game = this.gameRepository.getById(gameId);

    var amountOfActivePlayers = game.getPlayers()
      .stream()
      .filter(Player.IS_PLAYER_BANKRUPT_PREDICATE.negate())
      .toList();

    if (amountOfActivePlayers.size() == 1) this.makePlayerByIdWin(amountOfActivePlayers.get(0).getId());
  }

  /**
   * Removes all belongings of a player, and the bids they have performed within a game. This activity is typically
   * associated with bankruptcy.
   * <p>
   * Note:
   * This method only updates the state of the player. It does not save any GameAction, to represent the change
   * in state.
   *
   * @param playerId The id of the player who assets and bids will be erased.
   */
  private void removeActivityOf(long playerId) {
    var toBeClearedPlayer = this.playerRepository.getById(playerId);
    var game = toBeClearedPlayer.getGame();

    // Removes all belongings and bids in the toBeClearedPlayer's current state.
    toBeClearedPlayer.setPerformedLocationBids(List.of());
    toBeClearedPlayer.setPerformedJailBreakCardBids(List.of());
    toBeClearedPlayer.setReceivedJailBreakCardBids(List.of());
    toBeClearedPlayer.setReceivedLocationBids(List.of());

    toBeClearedPlayer.setProperties(List.of());
    toBeClearedPlayer.setCards(List.of());
    toBeClearedPlayer.setMoney(0);
    toBeClearedPlayer.setPosition(0);

    // Remove bids associated with belongings of other players in the game.
    // And saves changes to the database.
    for (Player player : game.getPlayers()) {
      if (player.equals(toBeClearedPlayer)) continue;

      player.setPerformedLocationBids(
        removeBidsAssociatedWith(player.getPerformedLocationBids(), toBeClearedPlayer));
      player.setPerformedJailBreakCardBids(
        removeBidsAssociatedWith(player.getPerformedJailBreakCardBids(), toBeClearedPlayer));
      player.setReceivedJailBreakCardBids(
        removeBidsAssociatedWith(player.getReceivedJailBreakCardBids(), toBeClearedPlayer));
      player.setReceivedLocationBids(
        removeBidsAssociatedWith(player.getReceivedLocationBids(), toBeClearedPlayer));

      this.playerRepository.save(player);
    }
  }

  private void switchPlayers(long currentPlayerId) {
    var currentPlayer = this.playerRepository.getById(currentPlayerId);
    var currentGame = this.gameRepository.getById(currentPlayer.getGame().getId());

    if (currentPlayer.getMoney() < 0) this.declarePlayerBankrupt(currentPlayerId);

    var activePlayers = currentGame.getPlayers()
      .stream()
      .filter(Player.IS_PLAYER_BANKRUPT_PREDICATE.negate())
      .sorted(Comparator.comparingInt(Player::getTurnNumber))
      .toList();

    var nextPlayerTurn = 0;

    {
      // Get the player with the turn number larger than the currentPlayer;
      for (Player activePlayer : activePlayers) {
        if (Comparator.comparingInt(Player::getTurnNumber).compare(currentPlayer, activePlayer) >= 0) continue;
        nextPlayerTurn = activePlayer.getTurnNumber();
        break;
      }

      // Get the active player with the smallest turn number.
      if (nextPlayerTurn == 0)
        for (Player activePlayer : activePlayers) {
          if (Comparator.comparingInt(Player::getTurnNumber).compare(currentPlayer, activePlayer) <= 0)
            continue;
          nextPlayerTurn = activePlayer.getTurnNumber();
          break;
        }
    }

    // If the current player is the last active player he wins.
    if (nextPlayerTurn == 0) {
      this.makePlayerByIdWin(currentPlayerId);
      return;
    }

    {
      if (currentPlayer.getRoundsInJail() > 0 && currentPlayer.getRoundsInJail() < 3)
        currentPlayer.setRoundsInJail(currentPlayer.getRoundsInJail() + 1);
      else if (currentPlayer.getRoundsInJail() == 3)
        this.freeFromJail(currentPlayerId);
    }

    currentGame.setCurrentTurn(nextPlayerTurn);

    final int finalNextPlayerTurn = nextPlayerTurn;
    Player nextPlayer = activePlayers
      .stream()
      .filter(player -> player.getTurnNumber() == finalNextPlayerTurn)
      .findFirst()
      .get();

    var nextTurnEndMoment = LocalDateTime.now().plusMinutes(currentPlayer.getGame().getMaxTimeTurn());

    this.saveActions(
      currentGame.getId(),
      List.of(new SwitchPlayerAction(currentPlayer, nextPlayer, nextTurnEndMoment))
    );
  }

  public void checkIfTurnDurationExceededAndPunish(long gameId) {
    final int SKIP_TURN_TAX = 200;

    if (!this.gameRepository.existsById(gameId))
      throw new ResourceNotFound("The requested game does not exist.");

    GameSession game = this.gameRepository.getById(gameId);

    var gameStartAction = (StartGameAction) this.getLastActionOf(gameId, StartGameAction.class);
    var lastTurnSwitchAction = (SwitchPlayerAction) this.getLastActionOf(gameId, SwitchPlayerAction.class);
    Player guiltyPlayer = null;

    // If this is the first turn of the game, there is no SwitchPlayerAction.
    if (lastTurnSwitchAction == null
      && LocalDateTime.now().isAfter(gameStartAction.getFirstTurnEndsAt())
    ) guiltyPlayer = gameStartAction.getActor();

    if (lastTurnSwitchAction != null
      && LocalDateTime.now().isAfter(lastTurnSwitchAction.getTurnEndsAt())
    ) guiltyPlayer = lastTurnSwitchAction.getNewPlayer();

    if (guiltyPlayer == null) return;

    this.transfer(
      gameId,
      new SkipTurnTaxAction(guiltyPlayer, SKIP_TURN_TAX),
      true
    );

    this.switchPlayers(guiltyPlayer.getId());
  }

  private void movePlayer(
    long playerId,
    int distance,
    Integer diceRoll,
    boolean skipGo,
    boolean switchPlayers
  ) {
    final int DEFAULT_PASS_GO_REWARD = 200;

    var player = this.playerRepository.getById(playerId);
    var game = this.gameRepository.getById(player.getGame().getId());

    var previousPosition = player.getPosition();
    var destinationPosition = previousPosition + distance;
    var goPassed = false;

    // Correct for circular nature of board, and track whether go has been passed.
    if (destinationPosition > GameBoard.LAST_POSITION) {
      goPassed = true;
      destinationPosition -= GameBoard.LAST_POSITION;
    } else if (destinationPosition < GameBoard.FIRST_POSITION) destinationPosition += GameBoard.LAST_POSITION;

    // Update player state and persist game action.
    player.setPosition(destinationPosition);
    this.saveActions(
      game.getId(),
      List.of(new PlayerMoveAction(player, previousPosition, destinationPosition, skipGo))
    );

    // Reward the player passing go, with the DEFAULT_PASS_GO_REWARD.
    if (!skipGo && goPassed)
      this.transfer(game.getId(), new PassGoAction(player, DEFAULT_PASS_GO_REWARD), false);

    this.handleLandingOnNewLocation(playerId, destinationPosition, diceRoll, switchPlayers);
  }

  private void handleLandingOnNewLocation(
    long playerId,
    int position,
    Integer diceRoll,
    boolean switchPlayers
  ) {
    var player = this.playerRepository.getById(playerId);
    var game = this.gameRepository.getById(player.getGame().getId());

    Location destination = game.getGameBoard()
      .getLocations()
      .stream()
      .filter(location -> location.getPosition() == position)
      .findFirst()
      .get();

    if (destination instanceof OwnableLocation ownableLoc)
      this.handleLandingOnOwnableLocation(playerId, ownableLoc, diceRoll);

    else if (destination instanceof TaxLocation taxLoc)
      this.transfer(
        game.getId(),
        new PayTaxAction(player, taxLoc.getAmount()),
        true
      );

      // Do not switch turn when landing on a pick card location, so the player has the option to pick a card.
    else if (destination instanceof PickCardLocation) switchPlayers = false;

    else if (destination instanceof BoardCorner boardCorner)
      // Send the player to jail when landing on the go-to-jail corner.
      if (boardCorner.getType() == BoardCorner.BoardCornerType.GO_TO_JAIL) {
        this.switchPlayers(playerId);
        switchPlayers = false;
        // Switch turn before player is imprisoned, so player-attribute roundsInJails isn't adversely impacted.
        this.jail(playerId);
      }
    ;

    if (switchPlayers) this.switchPlayers(playerId);
  }

  private void handleLandingOnOwnableLocation(
    long playerId,
    OwnableLocation ownableLoc,
    Integer diceRoll
  ) {
    var player = this.playerRepository.getById(playerId);
    var game = this.gameRepository.getById(player.getGame().getId());
    var owner = this.playerService.getOwnerOf(game.getId(), ownableLoc.getId());

    if (owner.isPresent() && !owner.get().equals(player))
      if (ownableLoc instanceof Property prop) {
        int developmentLevel = game.getPropertyDevelopments()
          .stream()
          .filter(tracker -> tracker.isOf(prop))
          .findFirst().get()
          .getDevelopmentStage()
          .STAGE;

        var rent = prop.getRentWithNoHouse();
        switch (developmentLevel) {
          case 1 -> rent = prop.getRentWithOneHouse();
          case 2 -> rent = prop.getRentWithTwoHouses();
          case 3 -> rent = prop.getRentWithThreeHouses();
          case 4 -> rent = prop.getRentWithFourHouses();
          case 5 -> rent = prop.getRentWithHotel();
        }

        this.transfer(
          game.getId(),
          new RentCollectionAction(player, owner.get(), rent, prop),
          true
        );

      } else if (ownableLoc instanceof RailRoad rail) {
        int amountOfOwnedRailRoads = (int) owner.get()
          .getProperties()
          .stream()
          .filter(location -> location instanceof RailRoad)
          .distinct()
          .count();

        double rent = rail.getRent();
        switch (amountOfOwnedRailRoads) {
          case 2 -> rent = rail.getRentIfTwoAreOwned();
          case 3 -> rent = rail.getRentIfThreeOwned();
          case 4 -> rent = rail.getRentIfFourAreOwned();
        }

        this.transfer(
          game.getId(),
          new RentCollectionAction(player, owner.get(), rent, rail),
          true
        );
      } else if (ownableLoc instanceof Utility util) {
        var rent = util.getDiceRollRentFactor() * (diceRoll != null ? diceRoll : 0);

        this.transfer(
          game.getId(),
          new RentCollectionAction(player, owner.get(), rent, util),
          true
        );
      }
  }

  //endregion

  //region Performance of dynamic actions.

  private boolean hasPlayerRolledDiceDuringTheLastTurn(Player player) {
    var lastPlayerSwitch =
      (SwitchPlayerAction) this.getLastActionOf(player.getGame().getId(), SwitchPlayerAction.class);
    var gameStartedAction =
      (StartGameAction) this.getLastActionOf(player.getGame().getId(), StartGameAction.class);

    // If a dice-roll has been performed previously, validate if this was
    // done by the player during this turn.

    Predicate<GameAction> actionPerformedDuringLastTurn = action ->
      (lastPlayerSwitch != null && action.getPerformedAt().isAfter(lastPlayerSwitch.getPerformedAt())
        || lastPlayerSwitch == null && action.getPerformedAt().isAfter(gameStartedAction.getPerformedAt()));

    return player
      .getGame()
      .getActions()
      .stream()
      // Check if any of the actions are dice-rolls performed by
      // this player, after the start of his turn.
      .anyMatch(action -> action instanceof DiceRollAction
        && action.getActor().equals(player)
        && actionPerformedDuringLastTurn.test(action)
      );
  }

  public DiceRollAction rollDice(long gameId) {
    Player player = validateIfCurrentUserCanPerformActionAndHasCurrentTurn(gameId);

    // validate whether the player has rolled dice before during this turn.
    if (hasPlayerRolledDiceDuringTheLastTurn(player))
      throw new PreConditionFailed("You can only roll dice once during a turn.");

    // Throw actual dice.
    int diceOne = this.random.nextInt(6) + 1;
    int diceTwo = this.random.nextInt(6) + 1;
    int diceTotal = diceOne + diceTwo;

    var diceRollAction = new DiceRollAction(player, diceOne, diceTwo);
    saveActions(gameId, List.of(diceRollAction));

    // Check if the current player is in jail, if not move player by rolled amount.
    if (player.getRoundsInJail() > 0) {
      // If doubles have been rolled, free the player from jail.
      if (diceOne == diceTwo) this.freeFromJail(player.getId());

      // Switch turns after dice have been rolled.
      this.switchPlayers(player.getId());
    }
    // When not in prison, move the token of the player, by rolled value.
    else this.movePlayer(player.getId(), diceTotal, diceTotal, false, true);

    return diceRollAction;
  }

  public DrawCardAction drawCard(Card.CardType cardType, long gameId) {
    Player player = validateIfCurrentUserCanPerformActionAndHasCurrentTurn(gameId);

    // validate whether the player has rolled dice before during this turn.
    if (!hasPlayerRolledDiceDuringTheLastTurn(player))
      throw new PreConditionFailed("A card can only be picked, after rolling dice during your turn.");

    var currentLocation = player.getGame().getGameBoard().getLocations()
      .stream()
      .filter(loc -> loc.getPosition() == player.getPosition())
      .findFirst()
      .get();

    if (!(currentLocation instanceof PickCardLocation pickCardLocation)) throw new PreConditionFailed
      ("Cards can only be picked from the deck, when your standing on a card location.");
    else if (!pickCardLocation.getType().equals(cardType)) throw new PreConditionFailed
      ("You can only pick up a card from the deck of a type, equal to your current location.");

    var cardDeck = player.getGame().getGameBoard().getCards()
      .stream()
      .filter(c -> c.getType().equals(cardType))
      .toList();

    var drawnCard = cardDeck.get(random.nextInt(cardDeck.size()));
    var drawCardAction = new DrawCardAction(player, drawnCard);

    saveActions(player.getGame().getId(), List.of(drawCardAction));

    this.switchPlayers(player.getId());

    // Perform actions of the drawn card, unless it's a JailBreakCard.
    if (drawnCard instanceof JailBreakCard jailBreakCard) {
      player.add(jailBreakCard);
      this.playerRepository.save(player);
    } else this.performCardAction(player, drawnCard);

    return drawCardAction;
  }

  public CardUsageAction useJailBreakCard(long gameId) {
    Player player = validateIfCurrentUserCanPerformAction(gameId);

    // Validate if player is in jail and owns a card.
    if (player.getCards().isEmpty())
      throw new PreConditionFailed("You do not own a get out of jail card, acquire one first.");
    if (player.getRoundsInJail() < 1)
      throw new PreConditionFailed("You can only use a get out of jail card, if you are in prison.");

    // Get and remove card from belongings.
    var jailBreakCard = player.getCards().stream().findFirst().get();
    player.getCards().remove(jailBreakCard);

    // Free player from jail.
    return this.performCardAction(player, jailBreakCard);
  }

  private CardUsageAction performCardAction(Player player, Card card) {
    var cardUsageAction = new CardUsageAction(player, card);
    // Save the action of using the card.
    saveActions(player.getGame().getId(), List.of(cardUsageAction));

    if (card instanceof FreeMoneyCard freeMoneyCard)
      this.transfer(
        player.getGame().getId(),
        new ReceiveFreeMoneyAction(player, freeMoneyCard.getAmount()),
        false
      );

    else if (card instanceof PayMoneyCard payMoneyCard)
      this.transfer(
        player.getGame().getId(),
        new PayTaxAction(player, payMoneyCard.getAmount()),
        true
      );

    else if (card instanceof GoToJailCard) this.jail(player.getId());

    else if (card instanceof MoveTokenToPositionCard moveTokenToPositionCard) {
      var distance = moveTokenToPositionCard.getToPosition() - player.getPosition();
      // Correct for circular nature of the board.
      if (distance < GameBoard.FIRST_POSITION) distance += GameBoard.LAST_POSITION;

      this.movePlayer(player.getId(), distance, null, false, false);
    } else if (card instanceof MoveTokenCard moveTokenCard)
      this.movePlayer(player.getId(), moveTokenCard.getDistance(), null, false, false);

    else if (card instanceof JailBreakCard) this.freeFromJail(player.getId());

    return cardUsageAction;
  }

  public LocationPurchaseAction purchaseLocationFromBank(long locationId, long gameId) {
    var currentPlayer = this.validateIfCurrentUserCanPerformAction(gameId);
    var game = this.gameRepository.getById(gameId);

    var location = (OwnableLocation) game.getGameBoard().getLocations()
      .stream()
      .filter(loc -> loc.getId() == locationId && loc instanceof OwnableLocation)
      .findFirst()
      .orElseThrow(() -> new ResourceNotFound("The desired property does not exist or cannot be purchased."));

    this.playerService
      .getOwnerOf(game.getId(), locationId)
      .ifPresent(owner -> {
        throw new ConflictException("This location is already owned. Make a bid to attempt a acquisition.");
      });

    if (currentPlayer.getPosition() != location.getPosition())
      throw new PreConditionFailed("A location can only be bought when you are standing on it.");

    if (!canPlayerPay(location.getInitialPurchasePrice(), currentPlayer.getId()))
      throw new PreConditionFailed("You do not have sufficient money to purchase this location.");

    var purchaseAction = new LocationPurchaseAction(
      currentPlayer,
      null,
      location.getInitialPurchasePrice(),
      location
    );

    // Transfer parties from currentPlayer to the bank.
    this.transfer(gameId, purchaseAction, false);

    // Add the location to the belongings of the currentPlayer.
    currentPlayer.add(location);
    this.playerRepository.save(currentPlayer);

    return purchaseAction;
  }

  public PropertyDevelopmentAction developProperty(
    long gameId,
    long locationId,
    Property.PropertyDevelopmentStage toStage
  ) {
    var currentPlayer = this.validateIfCurrentUserCanPerformAction(gameId);
    var currentGame = currentPlayer.getGame();

    if (!this.locationRepository.existsById(locationId))
      throw new ResourceNotFound("The desired property does not exist.");

    // Check if the requested location is a property and on the gameboard.
    var location = (Property) currentGame.getGameBoard()
      .getLocations()
      .stream()
      .filter(loc -> loc.getId() == locationId
        && loc instanceof Property)
      .findFirst()
      .orElseThrow(() ->
        new PreConditionFailed("Development is not possible on this property, or it does not exist in this game.")
      );

    // Check if the current player owns the property.
    var unownedPropertyException = new PreConditionFailed("You have to own a property in order to develop it.");
    var currentOwnerOfLocation = this.playerService.getOwnerOf(gameId, locationId);
    if (!currentOwnerOfLocation
      .orElseThrow(() -> unownedPropertyException).equals(currentPlayer)
    ) throw unownedPropertyException;

    var propertyDevelopment = currentGame.getPropertyDevelopments()
      .stream()
      .filter(development -> development.isOf(location))
      .findFirst().get();

    var fromStage = propertyDevelopment.getDevelopmentStage();
    var requiredDevelopment = toStage.STAGE - fromStage.STAGE;

    if (requiredDevelopment < 1)
      throw new PreConditionFailed("Only the development of a house/hotel is possible.");

    var developmentCost = location.getPropertyDevelopmentCost() * requiredDevelopment;

    if (!canPlayerPay(developmentCost, currentPlayer.getId()))
      throw new PreConditionFailed("You do not have enough money for development.");

    propertyDevelopment.setDevelopmentStage(toStage);
    this.gameRepository.save(currentGame);

    var propertyDevelopmentAction =
      new PropertyDevelopmentAction(currentPlayer, fromStage, toStage, developmentCost, location);

    this.transfer(
      gameId,
      propertyDevelopmentAction,
      false
    );

    saveActions(gameId, List.of(propertyDevelopmentAction));

    return propertyDevelopmentAction;
  }

  public LocationBidAction bidOnOwnedLocation(
    long gameId,
    long locationId,
    double bidAmount
  ) {
    var bidder = this.validateIfCurrentUserCanPerformAction(gameId);

    var location = (OwnableLocation) bidder.getGame().getGameBoard()
      .getLocations()
      .stream()
      .filter(loc -> loc.getId() == locationId && loc instanceof OwnableLocation)
      .findFirst()
      .orElseThrow(() ->
        new PreConditionFailed("Bidding is not possible on this location, or it does not exist in this game.")
      );

    var owner = this.playerService.getOwnerOf(gameId, locationId)
      .orElseThrow(() -> new PreConditionFailed("Bidding is only possible on owned properties."));

    if (bidAmount < 0) throw new BadRequest("A bid must be at least 0 dollar.");

    if (!canPlayerPay(bidAmount, bidder.getId()))
      throw new PreConditionFailed("You do not have enough money to bid this amount.");

    var bid = new OwnableLocation.OwnableLocationBid(owner, bidder, bidAmount, location);

    // Add bid to players.
    bidder.addPerformedBid(bid);
    owner.addReceivedBid(bid);

    // Persist to database.
    this.playerRepository.save(bidder);
    this.playerRepository.save(owner);

    var bidAction = new LocationBidAction(bidder, bid);

    saveActions(gameId, List.of(bidAction));

    return null;
  }

  //endregion

  //region Jail related methods

  private void freeFromJail(long playerId) {
    var player = this.playerRepository.getById(playerId);

    player.setRoundsInJail(0);

    this.saveActions(
      player.getGame().getId(),
      List.of(new FreeFromJailAction(player))
    );
  }

  private void jail(long playerId) {
    Player player = this.playerRepository.getById(playerId);
    player.setRoundsInJail(1);

    var distanceToJail = BoardCorner.DEFAULT_JAIL_LOCATION - player.getPosition();
    if (distanceToJail > GameBoard.LAST_POSITION) distanceToJail += GameBoard.LAST_POSITION;

    this.movePlayer(playerId, distanceToJail, null, true, true);

    this.saveActions(
      player.getGame().getId(),
      List.of(new GoToJailAction(player, BoardCorner.DEFAULT_JAIL_LOCATION))
    );
  }

  //endregion

  //region Helper methods

  /**
   * Returns a list of bids that are not associated with the toBeClearedPlayer, based on the provided bids.
   *
   * @param bids              The list that needs to be filtered from association with the toBeClearedPlayer.
   * @param toBeClearedPlayer Player, whose association needs to be removed.
   * @param <B>               The type of the bids that need to be cleared and returned.
   * @return A list of bids not associated with the toBeClearedPlayer.
   */
  private <B extends GameAsset.GameAssetBid> List<B> removeBidsAssociatedWith(
    List<B> bids,
    Player toBeClearedPlayer
  ) {
    return bids
      .stream()
      .filter(bid ->
        !bid.getOwner().equals(toBeClearedPlayer)
          && !bid.getBidder().equals(toBeClearedPlayer))
      .collect(Collectors.toCollection(ArrayList::new));
  }

  private boolean canPlayerPay(double amount, long playerId) {
    return this.playerRepository.getById(playerId).getMoney() >= amount;
  }

  /**
   * Transfers the amount of money, specified in the action, from the payee to the recipient.
   * <p>
   * Note:
   * A transfer only takes place when the payee has enough money to pay. Validate this in advance with the
   * canPlayerPay method. If enforcePayment is set the payee will be foreclosed on.
   *
   * @param gameId         Identifier of the GameSession, where these actions take place.
   * @param action         The act of exchanging money that needs to be performed.
   * @param enforcePayment Whether the amount owed by the payee in the MoneyExchangeAction
   *                       should result in a DebtForeClosure & Bankruptcy of the payee.
   * @return Whether the money exchange was successful. If enforce payment is true and false is returned, it means
   * that the payee was foreclosed and declared bankrupt.
   */
  private boolean transfer(
    long gameId,
    MoneyExchangeAction action,
    boolean enforcePayment
  ) {
    var payee = action.getActor();

    // If the payee is a player, validate if he can pay, otherwise foreclose on owed amount, if payment is enforced.
    // (null == the bank, which has infinite resources).
    if (payee != null && !canPlayerPay(action.getAmount(), payee.getId())) {
      if (enforcePayment) {
        this.saveActions(gameId, List.of(action));
        forecloseOnDebt(gameId, action);
        return false;
      }

      return false;
    }

    // Transfer the amount between the involved parties.
    this.transferFunds(gameId, action);

    return true;
  }

  /**
   * Takes all the money of the payee, and gives it to the recipient, of the provided MoneyExchangeAction. And
   * declares the payee bankrupt.
   * <p>
   * Note:
   * This method does not validate whether the player has sufficient funds to avoid foreclosure.
   *
   * @param gameId              Identifier of the GameSession, where these actions take place.
   * @param reasonOfForeclosure The money exchange, that resulted in the foreclusere of the payee.
   */
  private void forecloseOnDebt(
    long gameId,
    MoneyExchangeAction reasonOfForeclosure
  ) {
    Player payee = reasonOfForeclosure.getActor();

    this.transferFunds(
      gameId,
      new DebtForeclosureAction(
        payee,
        reasonOfForeclosure.getRecipient(),
        payee.getMoney() > 0 ? payee.getMoney() : 0,
        reasonOfForeclosure
      )
    );

    this.declarePlayerBankrupt(payee.getId());
  }

  /**
   * Performs the provided money exchange action with no validation, by adjusting the money balance of involved players and
   * persisting the action to the database.
   * <p>
   * Note:
   * Use the <code>transfer</code> method, as a default, to perform a money exchange action.
   *
   * @param gameId Identifier of the GameSession, where these actions take place.
   * @param action The act of exchanging money that needs to take place.
   */
  private void transferFunds(
    long gameId,
    MoneyExchangeAction action
  ) {
    Player payee = action.getActor();
    Player recipient = action.getRecipient();

    // Deduct the amount from the payee and save, if it is a player.
    if (payee != null) {
      payee.setMoney(payee.getMoney() - action.getAmount());
      this.playerRepository.save(payee);
    }

    // Add the amount to the recipient and save, if it is a player.
    if (recipient != null) {
      recipient.setMoney(recipient.getMoney() + action.getAmount());
      this.playerRepository.save(recipient);
    }

    saveActions(gameId, List.of(action));
  }

  /**
   * Persists the list of GameActions to the database. And associates each GameAction with the GameSession of gameId.
   *
   * @param gameId  The id of the GameSession the actions belong to.
   * @param actions List of actions that need to be persisted.
   */
  private void saveActions(long gameId, List<GameAction> actions) {
    GameSession game = gameRepository.getById(gameId);

    for (GameAction action : actions) {
      action.setGameSession(game);
      this.gameActionRepository.save(action);
      game.add(action);
    }

  }

  public GameAction getLastActionOf(long gameId, Class<? extends GameAction> type) {
    if (!this.gameRepository.existsById(gameId))
      throw new ResourceNotFound("The requested game does not exist.");

    var game = this.gameRepository.getById(gameId);

    return game.getActions().stream()
      .filter(type::isInstance)
      .max(Comparator.comparingLong(GameAction::getId))
      .orElse(null);
  }

  private boolean isItTurnOf(long playerId) {
    var player = playerRepository.getById(playerId);

    return player.getGame().getCurrentTurn() == player.getTurnNumber();
  }

  private Player validateIfCurrentUserCanPerformActionAndHasCurrentTurn(long gameId) {
    var currentPlayer = this.validateIfCurrentUserCanPerformAction(gameId);

    if (!isItTurnOf(currentPlayer.getId()))
      throw new PreConditionFailed("It is not yet your turn to perform an action.");

    return currentPlayer;
  }

  private Player validateIfCurrentUserCanPerformAction(long gameId) {
    if (!this.gameRepository.existsById(gameId))
      throw new ResourceNotFound("The requested game does not exist.");

    var game = gameRepository.getById(gameId);
    var currentPlayer = playerRepository.findBy(
      game,
      SecurityContextHelper.getCurrentlyLoggedInUser()
        .orElseThrow(() -> new UnauthorizedException("You are not logged in.")));

    if (currentPlayer.isEmpty())
      throw new ResourceNotFound("You cannot play this game, because you are not a member.");

    if (game.getState() != GameSession.GameSessionState.STARTED)
      throw new PreConditionFailed("Actions cannot be performed in a game that is not ongoing.");

    return currentPlayer.get();
  }

  //endregion
}