package nl.hva.backend.config.security;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


/**
 * The configuration needed for the en-/decoding of JSON Web Tokens.
 *
 * @author Hamza el Haouti
 */
@Component
@Getter
public class JWTConfig {

  @Value("${jwt.issuer:MyOrganisation}")
  private String issuer;

  @Value("${jwt.pass-phrase}")
  private String passPhrase;

}