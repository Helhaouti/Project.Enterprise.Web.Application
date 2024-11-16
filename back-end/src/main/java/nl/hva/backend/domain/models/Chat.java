package nl.hva.backend.domain.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hva.backend.domain.models.user.User;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class Chat {

  @Id
  @GeneratedValue()
  private int id;

  private String message;
  private String time;
  private int gameId;

  @Transient
  private User user;

  private String username;

  public Chat(String message, String time, int gameId, User user) {
    this.message = message;
    this.time = time;
    this.gameId = gameId;
    this.user = user;
    this.username = user.getUsername();
  }

}
