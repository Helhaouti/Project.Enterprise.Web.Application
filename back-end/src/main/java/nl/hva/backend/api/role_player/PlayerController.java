package nl.hva.backend.api.role_player;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.dto.user.UpdateUserRequest;
import nl.hva.backend.domain.exceptions.BadRequest;
import nl.hva.backend.domain.exceptions.InternalServerError;
import nl.hva.backend.domain.exceptions.ResourceNotFound;
import nl.hva.backend.domain.exceptions.UnauthorizedException;
import nl.hva.backend.domain.models.user.User;
import nl.hva.backend.domain.models.user.UserRole;
import nl.hva.backend.repositories.UserRepository;
import nl.hva.backend.services.UserProfilePictureStorageService;
import nl.hva.backend.services.UserService;
import nl.hva.backend.utils.JWTUtil;
import nl.hva.backend.utils.SecurityContextHelper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import java.io.File;
import java.nio.file.Files;
import java.util.Objects;

import static nl.hva.backend.utils.JWTUtil.JWT_AUTHORIZATION_TOKEN_PREFACE;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;


/**
 * The end-points where a user can perform actions to his profile.
 *
 * @author Hamza el Haouti
 */
@RequiredArgsConstructor
@RestController
@RolesAllowed({UserRole.PLAYER})
@RequestMapping("api/player")
public class PlayerController {

  private final UserService userService;
  private final UserRepository userRepository;
  private final UserProfilePictureStorageService storageService;
  private final AuthenticationManager authenticator;
  private final JWTUtil tokenHelper;

  /**
   * Updates the current user's profile information with the provided attributes, if the attribute is not null.
   *
   * @param updateUserRequest A object with attributes that should be updated.
   * @return A object containing the updated user profile.
   */
  @PutMapping("/details")
  public ResponseEntity<Object> updatePlayerDetails(@RequestBody @Valid UpdateUserRequest updateUserRequest) {

    Authentication authenticate = null;

    try {
      authenticate = authenticator.authenticate(updateUserRequest.getLoginRequest().toAuthToken());
    } catch (BadCredentialsException ex) {
      throw new UnauthorizedException("Email and/or password is not valid.");
    }

    if (((User) authenticate.getPrincipal()).getId() != updateUserRequest.getId())
      throw new UnauthorizedException("You have no right to edit this account.");

    User updatedUser = this.userService.update(updateUserRequest);

    return ResponseEntity.accepted()
      .header(ACCESS_CONTROL_EXPOSE_HEADERS, AUTHORIZATION)
      .header(AUTHORIZATION,
        JWT_AUTHORIZATION_TOKEN_PREFACE + tokenHelper.generateTokenFor(updatedUser))
      .body(updatedUser);
  }

  /**
   * Updates or saves a new profile picture for the user with the given user id. This, however, is only done
   * when the provided file is in png format, and the logged-in user is equal to the requested user.
   *
   * @param profilePic A file in png format, that the user wants as his profile picture
   * @param userId     The user id to which the profile picture belongs
   * @return HTTP errors or a succes message
   */
  @PutMapping("/profile-pic/{userId}")
  public ResponseEntity<Object> updatePlayerProfilePic(
    @RequestParam("profile_picture") MultipartFile profilePic,
    @PathVariable Long userId
  ) {
    // Validation of parameters.
    if (profilePic.isEmpty()) throw new BadRequest("No file attached!");
    if (userId == null) throw new BadRequest("No user id provided in path!");

    // Check if the user has authority to modify the user profile picture.
    User userOfRequest = this.userRepository.getById(userId);

    if (!isEqualToPrincipal(userOfRequest))
      throw new UnauthorizedException("You do not have permission to modify this profile picture!");

    // Store the profile picture.
    storageService.save(profilePic, userId.toString());

    return ResponseEntity.accepted().build();
  }

  /**
   * Returns the profile picture that belongs to the requested user id. If the profile picture is found.
   *
   * @param userId The id of the profile picture.
   * @return HTTP errors or a image file in png format.
   */
  @GetMapping(
    value = "/profile-pic/{userId}",
    produces = MediaType.IMAGE_PNG_VALUE
  )
  public @ResponseBody
  byte[] getProfilePicBy(@PathVariable Long userId) {
    // Check if the profile picture exists.
    File requestedProfilePicture = storageService.getBy(userId.toString());
    if (!requestedProfilePicture.exists())
      throw new ResourceNotFound("Profile pic not found of user by id: " + userId);

    // Read the file from storage and return it.
    byte[] content;

    try {
      content = Files.readAllBytes(requestedProfilePicture.toPath());
    } catch (Exception e) {
      throw new InternalServerError("The file could not be retrieved.");
    }

    return content;
  }

  /**
   * Deletes the profile picture for the user with the given user id. This, however, is only done
   * when the file exists, and the logged-in user is equal to the requested user.
   *
   * @param userId The user id to which the profile picture belongs
   */
  @DeleteMapping("/profile-pic/{userId}")
  public void deleteProfilePicBy(@PathVariable Long userId) {
    // Check if the user has authority to modify the user profile picture.
    User userOfRequest = userRepository.getById(userId);
    if (!isEqualToPrincipal(userOfRequest))
      throw new UnauthorizedException("You do not have permission to modify this profile picture!");

    // Check if the profile picture exists.
    File requestedProfilePicture = storageService.getBy(userId.toString());
    if (!requestedProfilePicture.exists())
      throw new ResourceNotFound("Profile pic could not found of user by id: " + userId);

    // Read the file from storage and return it.
    storageService.deleteBy(userId.toString());
  }

  /**
   * Checks whether the currently logged-in user is equal to the provided user.
   *
   * @return Whether they are equal.
   */
  boolean isEqualToPrincipal(User userOfRequest) {
    User loggedInUser = SecurityContextHelper.getCurrentlyLoggedInUser().get();

    return Objects.equals(userOfRequest, loggedInUser);
  }

}