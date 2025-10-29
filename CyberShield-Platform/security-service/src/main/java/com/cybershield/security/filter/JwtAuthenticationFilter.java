package com.cybershield.security.filter;

import com.cybershield.security.jwt.JwtTokenProvider;
import com.cybershield.security.service.ZeroTrustSecurityService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider tokenProvider;
    private final ZeroTrustSecurityService zeroTrustSecurityService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, ZeroTrustSecurityService zeroTrustSecurityService) {
        this.tokenProvider = tokenProvider;
        this.zeroTrustSecurityService = zeroTrustSecurityService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            resolveToken(request)
                .filter(tokenProvider::validateToken)
                .map(tokenProvider::getAuthentication)
                .ifPresent(authentication -> applySecurityContext(authentication, request));
        } catch (SecurityException ex) {
            LOGGER.warn("Zero-trust enforcement blocked request: {}", ex.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        } catch (Exception ex) {
            LOGGER.error("Unexpected error during JWT authentication", ex);
        }

        filterChain.doFilter(request, response);
    }

    private void applySecurityContext(Authentication authentication, HttpServletRequest request) {
        SecurityContext context = zeroTrustSecurityService.enforceZeroTrust(authentication, request);
        SecurityContextHolder.setContext(context);
    }

    private Optional<String> resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return Optional.of(bearerToken.substring(7));
        }
        return Optional.empty();
    }
}
