package nl.hva.backend.services;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.dto.user.CreateUserRequest;
import nl.hva.backend.domain.dto.user.UpdateUserRequest;
import nl.hva.backend.domain.exceptions.ConflictException;
import nl.hva.backend.domain.exceptions.ResourceNotFound;
import nl.hva.backend.domain.models.CountryCode;
import nl.hva.backend.domain.models.user.User;
import nl.hva.backend.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import static org.springframework.util.StringUtils.hasLength;


/**
 * Service for operations on the User entities. It also implements UserDetailsService, allowing it to
 * be used as a user DAO, throughout the Spring Security.
 *
 * @author Hamza el Haouti
 */
@Service
@Transactional
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

  private final UserRepository userRepo;
  private final RoleService roleService;
  private final PasswordEncoder encoder;

  /**
   * Creates a user based on the provided request.
   */
  public User create(CreateUserRequest req) {
    if (this.userRepo.findUserByUsername(req.getUsername()).isPresent())
      throw new ConflictException("Username already exists.");

    var user = new User();

    user.setUsername(req.getUsername());
    user.setFirstName(req.getFirstName());
    user.setLastName(req.getLastName());
    user.setPassword(encoder.encode(req.getPassword()));
    user.setCountryCode(req.getCountryCode());
    user.setEmail(req.getEmailAddress());

    this.userRepo.save(user);

    return roleService.addPlayerRoleToUserById(user.getId());
  }

  /**
   * Updates specific information of user based on the provided request.
   */
  public User update(UpdateUserRequest req) {
    if (!this.userRepo.existsById(req.getId()))
      throw new ResourceNotFound("Could not find the account, that corresponds with your request.");

    User user = this.userRepo.getById(req.getId());

    if (req.getUsername() != null) user.setUsername(req.getUsername());
    if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
    if (req.getLastName() != null) user.setLastName(req.getLastName());
    if (req.getEmail() != null) user.setEmail(req.getEmail());
    if (req.getCountryCode() != null) user.setCountryCode(CountryCode.valueOf(req.getCountryCode()));
    if (req.getPassword() != null) user.setPassword(encoder.encode(req.getPassword()));

    return this.userRepo.save(user);
  }

  /**
   * Returns a user entity, with the provided userName if it exists, otherwise null.
   */
  public User findByUserName(String username) {
    if (!hasLength(username)) return null;

    return userRepo.findUserByUsername(username).orElse(null);
  }

  /**
   * {@inheritDoc}
   *
   * @param username {@inheritDoc}
   * @return {@inheritDoc}
   * @throws UsernameNotFoundException {@inheritDoc}
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    final var USER_NOT_FOUND_EXCEPTION = new UsernameNotFoundException(
      String.format("User with username - %s, not found", username)
    );

    return userRepo
      .findUserByUsername(username)
      .orElseThrow(() -> USER_NOT_FOUND_EXCEPTION);
  }

}