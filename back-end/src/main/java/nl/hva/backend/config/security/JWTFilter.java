package nl.hva.backend.config.security;

import lombok.RequiredArgsConstructor;
import nl.hva.backend.services.UserService;
import nl.hva.backend.utils.JWTUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

import static nl.hva.backend.utils.JWTUtil.JWT_AUTHORIZATION_TOKEN_PREFACE;
import static org.springframework.util.StringUtils.hasLength;


/**
 * A filter to capture JWT tokens embedded in HTTP Authorizations header from incoming requests.
 * If a JWT is present it validates it and authenticates the user.
 *
 * @author Hamza el Haouti
 */
@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

  private final UserService userService;
  private final JWTUtil tokenUtil;

  @Override
  protected void doFilterInternal(
    HttpServletRequest req,
    HttpServletResponse res,
    FilterChain chain
  ) throws
    ServletException,
    IOException {

    String header = req.getHeader(HttpHeaders.AUTHORIZATION);

    // Check if a JWT is not present in the header, and pass to the next filter.
    if (!hasLength(header) || !header.startsWith(JWT_AUTHORIZATION_TOKEN_PREFACE)) {
      chain.doFilter(req, res);
      return;
    }

    String token = header.replace(JWT_AUTHORIZATION_TOKEN_PREFACE, "").trim();

    // Check if the provided JWT token is invalid, and pass to the next filter.
    if (!tokenUtil.validate(token)) {
      chain.doFilter(req, res);
      return;
    }

    // Assign the user to the spring security context, and pass to the next filter.
    var user = userService.findByUserName(tokenUtil.getUsernameOf(token));

    if (user != null) {
      var authToken = new UsernamePasswordAuthenticationToken(
        user,
        null,
        Objects.requireNonNullElse(user.getAuthorities(), List.of()));

      authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
      SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    chain.doFilter(req, res);
  }

}