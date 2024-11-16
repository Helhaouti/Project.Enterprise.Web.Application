package nl.hva.backend;

import nl.hva.backend.domain.dto.user.CreateUserRequest;
import nl.hva.backend.domain.dto.user.LogInRequest;
import nl.hva.backend.domain.models.CountryCode;
import nl.hva.backend.domain.models.user.User;
import nl.hva.backend.utils.JWTUtil;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.test.annotation.DirtiesContext;

import static nl.hva.backend.utils.JWTUtil.JWT_AUTHORIZATION_TOKEN_PREFACE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


/**
 * @author Hamza el Haouti
 */
@SpringBootTest(
  webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@TestMethodOrder(MethodOrderer.MethodName.class)
@TestInstance(value = TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext
public class AuthenticationTest {

  @Autowired
  private JWTUtil jwtUtil;

  @Autowired
  private TestRestTemplate restTemplate;

  private static final String AUTHENTICATION_API_BASE = "/api/authenticate";
  private static final String REGISTER_API = "/register";
  private static final String LOGIN_API = "/login";

  @Test
  public void T1_createNewUserAccount() {
    // Arrange: Needed parameters.
    final String REGISTER_ENDPOINT = AUTHENTICATION_API_BASE + REGISTER_API;
    final CreateUserRequest CREATE_USER_REQUEST = new CreateUserRequest(
      "test5",
      "test5",
      "test5",
      "test5",
      "test5@test.nl",
      CountryCode.NL
    );

    // Act: Perform a request.
    var createUserResponse = this.restTemplate.postForEntity(
      REGISTER_ENDPOINT,
      CREATE_USER_REQUEST,
      User.class
    );


    // Assert: That the response is correct.
    assertEquals(
      HttpStatus.CREATED,
      createUserResponse.getStatusCode(),
      "The user could not be created."
    );

    var createdUser = createUserResponse.getBody();

    assertEquals(
      CREATE_USER_REQUEST.getUsername(),
      createdUser.getUsername(),
      "The created user does not have the right username."
    );
    assertEquals(
      CREATE_USER_REQUEST.getCountryCode(),
      createdUser.getCountryCode(),
      "The created user does not have the right country-code."
    );
    assertEquals(
      CREATE_USER_REQUEST.getEmailAddress(),
      createdUser.getEmail(),
      "The created user does not have the right email address."
    );
    assertEquals(
      CREATE_USER_REQUEST.getFirstName(),
      createdUser.getFirstName(),
      "The created user does not have the right first name."
    );
    assertEquals(
      CREATE_USER_REQUEST.getLastName(),
      createdUser.getLastName(),
      "The created user does not have the right last name."
    );


    this.validateAuthToken(createUserResponse.getHeaders());

    // Assert that the created user can login.

    // Arrange: Needed parameters.
    final var LOGIN_ENDPOINT = AUTHENTICATION_API_BASE + LOGIN_API;
    final var LOG_IN_REQUEST = new LogInRequest(
      CREATE_USER_REQUEST.getUsername(),
      CREATE_USER_REQUEST.getPassword()
    );

    // Act: perform a request.
    var logInResponse = this.restTemplate.postForEntity(
      LOGIN_ENDPOINT,
      LOG_IN_REQUEST,
      User.class
    );

    // Assert: That the response is correct.
    assertEquals(
      HttpStatus.ACCEPTED,
      logInResponse.getStatusCode(),
      "The user could not log in."
    );

    this.validateAuthToken(logInResponse.getHeaders());
  }

  private void validateAuthToken(HttpHeaders headers) {
    // Assert
    assertTrue(
      headers.containsKey(HttpHeaders.AUTHORIZATION),
      "No JWT Token has been provided."
    );

    var token = headers
      .get(HttpHeaders.AUTHORIZATION)
      .get(0)
      .replace(JWT_AUTHORIZATION_TOKEN_PREFACE, "")
      .trim();

    assertTrue(
      jwtUtil.validate(token),
      "The provided token is not valid."
    );
  }

}