package nl.hva.backend.api.role_player;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.action.impl.card.CardUsageAction;
import nl.hva.backend.domain.models.game.action.impl.card.DrawCardAction;
import nl.hva.backend.domain.models.game.action.impl.gamePlay.DiceRollAction;
import nl.hva.backend.domain.models.game.action.impl.money.moneyExchangeImpl.PropertyDevelopmentAction;
import nl.hva.backend.domain.models.game.action.impl.property.LocationBidAction;
import nl.hva.backend.domain.models.game.action.impl.property.LocationPurchaseAction;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;
import nl.hva.backend.domain.models.game.card.Card;
import nl.hva.backend.services.GameActionService;
import nl.hva.backend.services.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;


@RestController
@RequestMapping("api/game/{gameId}/action")
@RequiredArgsConstructor
public class GameActionController {

  private final GameService gameService;
  private final GameActionService actionService;

  @GetMapping
  public List<GameAction> getAllActions(@PathVariable String gameId) {
    return gameService.getGameActionOfGameBy(Long.parseLong(gameId));
  }

  @GetMapping("/{actionId}")
  public List<GameAction> getAllActionsNewerThan(
    @PathVariable String gameId,
    @PathVariable String actionId
  ) {
    return gameService.getGameActionsNewerThanGameAction(Long.parseLong(gameId), Long.parseLong(actionId));
  }

  @PostMapping(path = "/rollDice")
  public ResponseEntity<DiceRollAction> performDiceRoll(@PathVariable String gameId) {
    var action = actionService.rollDice(Long.parseLong(gameId.trim()));

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(action.getId())
      .toUri();


    return ResponseEntity.created(location).body(action);
  }

  @PostMapping(path = "/card/draw/chest")
  public ResponseEntity<DrawCardAction> performChestCardDraw(@PathVariable String gameId) {
    var action = actionService.drawCard(Card.CardType.CHEST, Long.parseLong(gameId.trim()));

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(action.getId())
      .toUri();

    return ResponseEntity.created(location).body(action);
  }

  @PostMapping(path = "/card/draw/chance")
  public ResponseEntity<DrawCardAction> performChanceCardDraw(@PathVariable String gameId) {
    var action = actionService.drawCard(Card.CardType.CHANCE, Long.parseLong(gameId.trim()));

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(action.getId())
      .toUri();

    return ResponseEntity.created(location).body(action);
  }

  @PostMapping(path = "/useJailBreakCard")
  public ResponseEntity<CardUsageAction> useJailBreakCard(@PathVariable String gameId) {
    var action = actionService.useJailBreakCard(Long.parseLong(gameId.trim()));

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(action.getId())
      .toUri();

    return ResponseEntity.created(location).body(action);
  }

  @PostMapping(path = "/location/buy/{locationId}")
  public ResponseEntity<LocationPurchaseAction> purchaseLocationFromBank(
    @PathVariable String gameId,
    @PathVariable String locationId
  ) {
    var action = actionService.purchaseLocationFromBank(
      Long.parseLong(locationId.trim()),
      Long.parseLong(gameId.trim())
    );

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(action.getId())
      .toUri();

    return ResponseEntity
      .created(location)
      .body(action);
  }

  @PostMapping(path = "/location/develop/{locationId}/{toStage}")
  public ResponseEntity<PropertyDevelopmentAction> developProperty(
    @PathVariable String gameId,
    @PathVariable String locationId,
    @PathVariable Property.PropertyDevelopmentStage toStage
  ) {
    var action = actionService.developProperty(
      Long.parseLong(gameId.trim()),
      Long.parseLong(locationId.trim()),
      toStage
    );

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(action.getId())
      .toUri();

    return ResponseEntity.created(location).body(action);
  }

  @PostMapping(path = "/location/bid/{locationId}/{amount}/")
  public ResponseEntity<LocationBidAction> bidOnOwnedLocation(
    @PathVariable String gameId,
    @PathVariable String locationId,
    @PathVariable String amount
  ) {
    var action = actionService.bidOnOwnedLocation(
      Long.parseLong(locationId.trim()),
      Long.parseLong(gameId.trim()),
      Double.parseDouble(amount.trim())
    );

    URI location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(action.getId())
      .toUri();

    return ResponseEntity.created(location).body(action);
  }

}