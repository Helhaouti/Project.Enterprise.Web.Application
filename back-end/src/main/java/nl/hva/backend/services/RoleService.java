package nl.hva.backend.services;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.domain.models.user.User;
import nl.hva.backend.domain.models.user.UserRole;
import nl.hva.backend.repositories.RoleRepository;
import nl.hva.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.function.Consumer;


/**
 * A service to perform operations on UserRoles.
 *
 * @author Hamza el Haouti
 */
@Transactional
@Service
@RequiredArgsConstructor
public class RoleService {

  private final RoleRepository roleRepo;
  private final UserRepository userRepo;

  public User addPlayerRoleToUserById(long userId) {
    User user = userRepo.getById(userId);
    UserRole role = new UserRole(UserRole.PLAYER);

    checkIfRoleExists(
      role.getAuthority(),
      user::addRole,
      () -> user.addRole(roleRepo.save(role))
    );

    return userRepo.save(user);
  }

  public User addAdminRoleToUserById(long userId) {
    User user = userRepo.getById(userId);
    UserRole role = new UserRole(UserRole.ADMIN);

    checkIfRoleExists(
      role.getAuthority(),
      user::addRole,
      () -> user.addRole(roleRepo.save(role))
    );

    return userRepo.save(user);
  }

  private void checkIfRoleExists(
    String authority,
    Consumer<UserRole> ifExists,
    Runnable ifAbsent
  ) {
    roleRepo
      .findUserRoleByAuthorityEquals(authority)
      .ifPresentOrElse(ifExists, ifAbsent);
  }

}