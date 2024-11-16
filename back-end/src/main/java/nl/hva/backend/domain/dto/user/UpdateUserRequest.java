package nl.hva.backend.domain.dto.user;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.Min;


@Data
public class UpdateUserRequest {

  @Min(value = 1, message = "Does not exist.")
  private long id;

  private String username;
  private String firstName;
  private String lastName;
  private String email;
  private String countryCode;
  private String password;

  @Valid
  private LogInRequest loginRequest;

}