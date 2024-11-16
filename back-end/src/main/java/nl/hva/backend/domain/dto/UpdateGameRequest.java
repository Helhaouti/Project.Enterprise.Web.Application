package nl.hva.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;


@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UpdateGameRequest {

  @Min(value = 1, message = "Needs to be at least 1 minute.")
  @Max(value = 5, message = "May at most be 5 minutes.")
  @NotNull(message = "Not provided.")
  private Integer maxTimeTurn;

  @Min(value = 1, message = "Needs to be at least 1 hour.")
  @Max(value = 4, message = "May at most be 4 hours.")
  @NotNull(message = "Not provided.")
  private Integer maxGameTime;

}
