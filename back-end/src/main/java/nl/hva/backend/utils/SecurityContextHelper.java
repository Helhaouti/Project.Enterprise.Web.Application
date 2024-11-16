package nl.hva.backend.utils;

import nl.hva.backend.domain.models.user.User;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;


/**
 * Utility for the retrieval of the user instance attached to the current request.
 *
 * @author Hamza el Haouti
 */
public class SecurityContextHelper {

  private SecurityContextHelper() {
  }

  public static Optional<User> getCurrentlyLoggedInUser() {
    var currentAuth = SecurityContextHolder.getContext().getAuthentication();

    if (currentAuth == null) return Optional.empty();

    return Optional.of(((User) currentAuth.getPrincipal()));
  }

}