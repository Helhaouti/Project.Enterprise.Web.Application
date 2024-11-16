package nl.hva.backend.config.audit;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;


/**
 * An implementation of a JPA Auditor. It provides the name of the currently
 * authenticated user making changes. So JPA can make sure that annotations,
 * such as @LastModifiedDate and more function.
 *
 * @author Hamza el Haouti
 */
public class CustomAuditorAware implements AuditorAware<String> {

  @Override
  public Optional<String> getCurrentAuditor() {
    var authentication = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());

    if (authentication.isEmpty())
      return Optional.of("Not signed in!");

    return Optional.of(authentication.get().getName());
  }

}