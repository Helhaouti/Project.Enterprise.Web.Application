package nl.hva.backend.config;

import nl.hva.backend.domain.exceptions.BadRequest;
import nl.hva.backend.domain.exceptions.ConflictException;
import nl.hva.backend.domain.exceptions.PreConditionFailed;
import nl.hva.backend.domain.exceptions.ResourceNotFound;
import nl.hva.backend.domain.exceptions.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Locale;


/**
 * Central configuration for how to display exceptions. Useful for automatic error message display, in the front-end.
 *
 * @author Hamza el Haouti
 */
@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BadRequest.class)
  public ResponseEntity<String> handleException(BadRequest e) {
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(e.getMessage());
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<String> handleException(UnauthorizedException e) {
    return ResponseEntity
      .status(HttpStatus.UNAUTHORIZED)
      .body(e.getMessage());
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<String> handleException(ConflictException e) {
    return ResponseEntity
      .status(HttpStatus.CONFLICT)
      .body(e.getMessage());
  }

  @ExceptionHandler(PreConditionFailed.class)
  public ResponseEntity<String> handleException(PreConditionFailed e) {
    return ResponseEntity
      .status(HttpStatus.PRECONDITION_FAILED)
      .body(e.getMessage());
  }

  @ExceptionHandler(ResourceNotFound.class)
  public ResponseEntity<String> handleException(ResourceNotFound e) {
    return ResponseEntity
      .status(HttpStatus.NOT_FOUND)
      .body(e.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
    StringBuilder errors = new StringBuilder();

    for (ObjectError error : ex.getBindingResult().getAllErrors())
      errors.append(String.format(Locale.ROOT, "%-15s: %-100s\n",
        ((FieldError) error).getField(),
        error.getDefaultMessage()));

    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(errors.toString());
  }

}