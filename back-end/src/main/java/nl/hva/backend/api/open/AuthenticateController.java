package nl.hva.backend.api.open;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.dto.user.CreateUserRequest;
import nl.hva.backend.domain.dto.user.LogInRequest;
import nl.hva.backend.domain.exceptions.UnauthorizedException;
import nl.hva.backend.domain.models.user.User;
import nl.hva.backend.services.UserService;
import nl.hva.backend.utils.JWTUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;

import static nl.hva.backend.utils.JWTUtil.JWT_AUTHORIZATION_TOKEN_PREFACE;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;


/**
 * The central place for the authentication of outside-users. Upon a successful login or registration it also
 * provides a JWToken, for future requests.
 *
 * @author Hamza el Haouti
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/authenticate")
public class AuthenticateController {

  private final AuthenticationManager authenticator;
  private final UserService userService;
  private final JWTUtil tokenHelper;

  /**
   * Checks whether the provided credentials are valid, and authenticates the user, by returning a JWT.
   *
   * @param credentials An object containing username and password attributes.
   * @return The user that belongs to the given credentials and a JWT for use in authentication.
   */
  @PostMapping("/login")
  public ResponseEntity<User> login(@RequestBody @Valid LogInRequest credentials) {
    Authentication authenticate;

    try {
      authenticate = authenticator.authenticate(credentials.toAuthToken());
    } catch (BadCredentialsException ex) {
      throw new UnauthorizedException("Email and/or password is not valid.");
    }

    User user = (User) authenticate.getPrincipal();

    return ResponseEntity.accepted()
      .header(
        AUTHORIZATION,
        JWT_AUTHORIZATION_TOKEN_PREFACE + tokenHelper.generateTokenFor(user)
      )
      .body(user);
  }

  /**
   * Creates a user with given parameters, when all parameters are provided and valid, in the provided object.
   *
   * @param req An object containing the attributes of the to be created User.
   * @return The created User object and a JWT token.
   */
  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody @Valid CreateUserRequest req) {
    User user = userService.create(req);

    return ResponseEntity
      .created(
        ServletUriComponentsBuilder
          .fromCurrentContextPath()
          .build()
          .toUri()
      )
      .header(
        AUTHORIZATION,
        JWT_AUTHORIZATION_TOKEN_PREFACE + tokenHelper.generateTokenFor(user)
      )
      .body(user);
  }

}