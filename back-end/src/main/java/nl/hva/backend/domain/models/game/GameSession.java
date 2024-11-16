package nl.hva.backend.domain.models.game;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.game.action.GameAction;
import nl.hva.backend.domain.models.game.board.GameBoard;
import nl.hva.backend.domain.models.game.board.location.Location;
import nl.hva.backend.domain.models.game.board.location.locationImpl.Property;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Entity
@EntityListeners(AuditingEntityListener.class)

@Getter
@Setter
@NoArgsConstructor
public class GameSession {

  public static final int MAX_GAME_PARTICIPANTS = 4;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /**
   * Maximum amount of players. Min=2. Max=4.
   */
  private Integer maxPlayers;

  private LocalDateTime startsAt;

  /**
   * Time between turns in minutes.
   */
  private Integer maxTimeTurn;

  private LocalDateTime endsAt;

  @ManyToOne(fetch = FetchType.EAGER)
  private GameBoard gameBoard;

  private int currentTurn = 1;

  /**
   * Tracks the development of properties present on the board.
   * <p>
   * Each property on the board is required and can only have 1 tracker.
   */
  @OneToMany(cascade = CascadeType.ALL)
  private List<Property.PropertyDevelopmentStageTracker> propertyDevelopments;

  @Enumerated(EnumType.STRING)
  private GameSessionState state;

  @OneToMany(mappedBy = "game")
  @JsonManagedReference
  private List<Player> players;

  @OneToMany(mappedBy = "gameSession")
  @JsonManagedReference
  private List<GameAction> actions;

  @CreatedBy
  private String creator;

  private LocalDateTime startedAt;


  public enum GameSessionState {
    JOINABLE,
    STARTED,
    COMPLETED
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Location location)) return false;
    return getId() == location.getId();
  }

  @Override
  public int hashCode() {
    return getId() == null ? 0 : Long.hashCode(getId());
  }

  public void add(GameAction action) {
    if (getActions() == null || !(getActions() instanceof ArrayList))
      setActions(new ArrayList<>(Objects.requireNonNullElse(getActions(), List.of())));
    if (action == null) return;

    getActions().add(action);
  }

  public void add(Property.PropertyDevelopmentStageTracker tracker) {
    if (getPropertyDevelopments() == null || !(getPropertyDevelopments() instanceof ArrayList))
      setPropertyDevelopments(new ArrayList<>(Objects.requireNonNullElse(getPropertyDevelopments(), List.of())));

    getPropertyDevelopments().add(tracker);
  }

  public void add(Player player) {
    if (getPlayers() == null || !(getPlayers() instanceof ArrayList))
      setPlayers(new ArrayList<>(Objects.requireNonNullElse(getPlayers(), List.of())));

    getPlayers().add(player);
  }

}
