package nl.hva.backend.repositories;

import nl.hva.backend.domain.models.user.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface RoleRepository extends JpaRepository<UserRole, Long> {

  Optional<UserRole> findUserRoleByAuthorityEquals(String authority);

}