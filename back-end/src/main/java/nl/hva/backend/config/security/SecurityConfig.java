package nl.hva.backend.config.security;

import nl.hva.backend.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

import static org.springframework.http.HttpMethod.POST;


/**
 * The security configuration of the application.
 *
 * @author Hamza el Haouti
 */
@EnableWebSecurity
@EnableGlobalMethodSecurity(
  securedEnabled = true,
  jsr250Enabled = true,
  prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  @Autowired
  private UserService userService;
  @Autowired
  private JWTFilter tokenFilter;
  @Autowired
  private PasswordEncoder passwordEncoder;

  /**
   * Creates an instance with the default configuration enabled.
   */
  public SecurityConfig() {
    super();

    // Inherit security context in async function calls
    SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
  }

  /**
   * {@inheritDoc}
   * <p>
   * <p>
   * Configures the AuthenticationManager to make use of the right UserService, in combination
   * with the default PassWordEncoder.
   *
   * @param auth
   * @throws Exception
   */
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth
      .userDetailsService(userService)
      .passwordEncoder(this.passwordEncoder);
  }

  /**
   * {@inheritDoc}
   * <p>
   * <p>
   * Current configuration:
   * Enables cors and disables csrf;
   * Allows same origin calls (for local testing purposes);
   * Sets session management to StateLess;
   * Sets a default unauthorized request handler;
   * Requires authentication on all routes, except for: H2-console, auth end-points and favicon.
   * And adds filter for JWT-based authentication.
   *
   * @param http {@inheritDoc}
   * @throws Exception {@inheritDoc}
   */
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // Enable CORS and disable CSRF
    http = http.cors()
      .and()
      .csrf().disable();

    // Allow same origin calls, useful for H2 Database.
    http = http
      .headers()
      .frameOptions()
      .sameOrigin()
      .and();

    // Set session management to stateless (for JWT)
    http = http
      .sessionManagement()
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and();

    // Set unauthorized requests exception handler
    http = http
      .exceptionHandling()
      .authenticationEntryPoint(
        (request, response, ex) -> {
          logger.error("Unauthorized request - {}", ex.getMessage());
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
        }
      )
      .and();

    // Set permissions on endpoints
    http.authorizeRequests()
      // Public endpoints
      .antMatchers(POST, "/api/authenticate/**").permitAll()
      .antMatchers("/h2-console/**").permitAll()
      .antMatchers("/favicon.ico/").permitAll()
      // Private endpoints
      .anyRequest().authenticated();

    // Add JWT token filter
    http.addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class);
  }

  /**
   * Creates a CorsFilter instance, with configuration:
   * Server is accessible by all;
   * User credentials allowed;
   * Only permitted HTTP methods are: GET, POST, PUT & DELETE;
   * Only Allowed and Exposed headers are: AUTHORIZATION & CONTENT_TYPE;
   * Applicable to all end-points;
   *
   * @return A properly configured CorsFilter instance.
   */
  @Bean
  public CorsFilter corsFilter() {
    var source = new UrlBasedCorsConfigurationSource();
    var config = new CorsConfiguration();

    config.setAllowCredentials(true);

    config.setAllowedOriginPatterns(List.of("*"));

    var responseHeaders = List.of(
      HttpHeaders.AUTHORIZATION,
      HttpHeaders.CONTENT_TYPE
    );

    config.setAllowedHeaders(responseHeaders);
    config.setExposedHeaders(responseHeaders);

    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));

    source.registerCorsConfiguration("/**", config);

    return new CorsFilter(source);
  }

  @Override
  @Bean
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

}
