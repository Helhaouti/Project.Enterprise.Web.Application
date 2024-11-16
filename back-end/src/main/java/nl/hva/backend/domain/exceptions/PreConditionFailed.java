package nl.hva.backend.domain.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * Runtime exception, that responds with HTTP error code 412 (PRECONDITION_FAILED).
 *
 * @author Hamza el Haouti
 */
@ResponseStatus(HttpStatus.PRECONDITION_FAILED)
public class PreConditionFailed extends RuntimeException {

  public PreConditionFailed(String message) {
    super(message);
  }

}