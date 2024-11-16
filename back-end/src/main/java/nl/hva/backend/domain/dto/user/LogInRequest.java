package nl.hva.backend.domain.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import javax.validation.constraints.NotBlank;


/**
 * An Object to store log in information and to do simple validation.
 *
 * @author Hamza el Haouti
 */
@Data
@AllArgsConstructor
public class LogInRequest {

  @NotBlank(message = "Not provided.")
  private String username;

  @NotBlank(message = "Not provided.")
  private String password;

  /**
   * @return A UsernamePasswordAuthenticationToken based on the credentials of this.
   */
  public UsernamePasswordAuthenticationToken toAuthToken() {
    return new UsernamePasswordAuthenticationToken(this.getUsername(), this.getPassword());
  }

}