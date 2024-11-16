package nl.hva.backend.domain.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * Runtime exception, that responds with HTTP error code 500 (INTERNAL_SERVER_ERROR).
 *
 * @author Hamza el Haouti
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class InternalServerError extends RuntimeException {

  public InternalServerError(String message) {
    super(message);
  }

}