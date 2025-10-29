package com.cybershield.security.service;

import jakarta.servlet.http.HttpServletRequest;
import java.io.Serial;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

@Component
public class LeastPrivilegeEnforcer {

    public Authentication apply(Authentication authentication, HttpServletRequest request) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Set<GrantedAuthority> scopedAuthorities = authorities.stream()
                .filter(authority -> isAuthorityAllowed(authority, request))
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                .collect(Collectors.toSet());

        if (scopedAuthorities.isEmpty()) {
            throw new AccessDeniedException("No privileges available for this action");
        }

        return new ScopedAuthentication(authentication, scopedAuthorities, request);
    }

    private boolean isAuthorityAllowed(GrantedAuthority authority, HttpServletRequest request) {
        String path = request.getRequestURI();
        String role = authority.getAuthority();
        if (path.startsWith("/api/admin")) {
            return role.equals("ROLE_ADMIN");
        }
        if (path.startsWith("/api/instructor")) {
            return role.equals("ROLE_INSTRUCTOR") || role.equals("ROLE_ADMIN");
        }
        if (path.startsWith("/api/student")) {
            return role.equals("ROLE_STUDENT");
        }
        return true;
    }

    private static class ScopedAuthentication implements Authentication {

        @Serial
        private static final long serialVersionUID = 1L;

        private final Authentication delegate;
        private final Collection<? extends GrantedAuthority> scopedAuthorities;
        private final WebAuthenticationDetails details;

        private ScopedAuthentication(Authentication delegate,
                                      Collection<? extends GrantedAuthority> scopedAuthorities,
                                      HttpServletRequest request) {
            this.delegate = delegate;
            this.scopedAuthorities = scopedAuthorities;
            this.details = new WebAuthenticationDetails(request);
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return scopedAuthorities;
        }

        @Override
        public Object getCredentials() {
            return delegate.getCredentials();
        }

        @Override
        public Object getDetails() {
            return details;
        }

        @Override
        public Object getPrincipal() {
            return delegate.getPrincipal();
        }

        @Override
        public boolean isAuthenticated() {
            return delegate.isAuthenticated();
        }

        @Override
        public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
            delegate.setAuthenticated(isAuthenticated);
        }

        @Override
        public String getName() {
            return delegate.getName();
        }
    }
}
