package nl.hva.backend.domain.models.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


/**
 * A JPA entity to manage application roles.
 *
 * @author Hamza el Haouti
 */
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserRole implements GrantedAuthority {

  public static final String ROLE_PREFIX = "ROLE_";
  public static final String ADMIN = ROLE_PREFIX + "ADMIN";
  public static final String PLAYER = ROLE_PREFIX + "PLAYER";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  /**
   * The name of the role (also called GrantedAuthority).
   */
  private String authority;

  public UserRole(String authority) {
    this.authority = authority;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof UserRole userRole)) return false;

    return getAuthority() != null
      ? getAuthority().equals(userRole.getAuthority())
      : userRole.getAuthority() == null;
  }

  @Override
  public int hashCode() {
    return getAuthority() != null ? getAuthority().hashCode() : 0;
  }

}