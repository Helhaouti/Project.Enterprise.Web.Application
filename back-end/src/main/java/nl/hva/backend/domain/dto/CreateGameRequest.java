package nl.hva.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;


/**
 * DTO object for the creation of a <code>GameSession</code> instance.
 *
 * @author Hamza el Haouti
 */

@Data
@AllArgsConstructor
public class CreateGameRequest {

  @Min(value = 2, message = "Needs to be at least 2 players.")
  @Max(value = 4, message = "May at most be 4 players.")
  @NotNull(message = "Not provided.")
  private Integer maxPlayers;

  @Min(value = 5, message = "Needs to be at least 5 minutes.")
  @Max(value = 60, message = "May at most be 60 minutes.")
  @NotNull(message = "Not provided.")
  private Integer waitingTime;

  @Min(value = 1, message = "Needs to be at least 1 minute.")
  @Max(value = 5, message = "May at most be 5 minutes.")
  @NotNull(message = "Not provided.")
  private Integer maxTimeTurn;

  @Min(value = 1, message = "Needs to be at least 1 hour.")
  @Max(value = 4, message = "May at most be 4 hours.")
  @NotNull(message = "Not provided.")
  private Integer maxGameTime;

}