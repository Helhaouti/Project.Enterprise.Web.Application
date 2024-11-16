package nl.hva.backend.config.audit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


/**
 * Provides the Spring with JPA auditor Bean, so it can monitor changes to JPA entities.
 *
 * @author Hamza el Haouti
 */
@Configuration
@EnableJpaAuditing
public class AuditorConfig {

  @Bean
  public CustomAuditorAware auditorProvider() {
    return new CustomAuditorAware();
  }

}