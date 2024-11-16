package nl.hva.backend.domain.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * Runtime exception, that responds with HTTP error code 403 (FORBIDDEN).
 *
 * @author Hamza el Haouti
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenResourceAccessed extends RuntimeException {

  public ForbiddenResourceAccessed(String message) {
    super(message);
  }

}