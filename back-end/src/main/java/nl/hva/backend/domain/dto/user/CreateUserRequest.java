package nl.hva.backend.domain.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import nl.hva.backend.domain.models.CountryCode;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;


/**
 * An object to store information about a request for the creation of a user.
 *
 * @author Hamza el Haouti
 */
@Data
@AllArgsConstructor
public class CreateUserRequest {

  @NotBlank(message = "Not provided.")
  private String firstName;

  @NotBlank(message = "Not provided.")
  private String lastName;

  @NotBlank(message = "Not provided.")
  private String username;

  @NotBlank(message = "Not provided.")
  private String password;

  @Email(message = "Not valid.")
  @NotBlank(message = "Not provided.")
  private String emailAddress;

  @NotNull(message = "Not provided.")
  private CountryCode countryCode;

}