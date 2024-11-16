package nl.hva.backend.domain.models.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import nl.hva.backend.domain.models.CountryCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;


/**
 * A JPA entity to model a user of this application.
 * <p>
 * It stores the user's:
 * Credentials (username & password);
 * Attributes (email, country, name, etc.);
 * Account status (expirations, enabled, etc.);
 *
 * @author Hamza el Haouti
 */
@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "AppUser")
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @CreatedDate
  private LocalDateTime createdAt;
  @LastModifiedDate
  private LocalDateTime modifiedAt;

  @Enumerated(EnumType.STRING)
  private CountryCode countryCode;

  @ManyToMany(fetch = FetchType.EAGER)
  @ToString.Exclude
  private Set<UserRole> roles = new HashSet<>();

  private String username;
  @JsonIgnore
  private String password;

  private String firstName;
  private String lastName;
  private String email;

  private boolean expired;
  private boolean locked;
  private boolean credentialsExpired;
  private boolean disabled;

  public User(long id) {
    this.id = id;
  }

  @JsonIgnore
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.getRoles();
  }

  @Override
  public boolean isAccountNonExpired() {
    return !this.expired;
  }

  @Override
  public boolean isAccountNonLocked() {
    return !this.locked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return !this.credentialsExpired;
  }

  @Override
  public boolean isEnabled() {
    return !this.disabled;
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) return true;
    if (!(other instanceof User otherUser)) return false;
    return getId() == otherUser.getId();
  }

  @Override
  public int hashCode() {
    return Long.hashCode(getId());
  }

  public void addRole(UserRole role) {
    if (getRoles() == null || !(getRoles() instanceof HashSet))
      setRoles(new HashSet<>(Objects.requireNonNullElse(getRoles(), Set.of())));

    getRoles().add(role);
  }

}