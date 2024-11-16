package nl.hva.backend.domain.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * Runtime exception, that responds with HTTP error code 400 (BAD_REQUEST).
 *
 * @author Hamza el Haouti
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequest extends RuntimeException {

  public BadRequest(String message) {
    super(message);
  }

}
