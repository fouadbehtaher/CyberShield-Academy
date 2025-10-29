package com.cybershield.auth.controller;

import com.cybershield.auth.security.JwtUtil;
import com.cybershield.auth.web.AuthenticationRequest;
import com.cybershield.auth.web.AuthenticationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private UserDetailsService userDetailsService;

        @PostMapping("/login")
        public ResponseEntity<AuthenticationResponse> createAuthenticationToken(
                        @RequestBody AuthenticationRequest authenticationRequest) throws Exception {
                try {
                        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                                        authenticationRequest.getUsername(),
                                        authenticationRequest.getPassword()
                        ));
                } catch (BadCredentialsException ex) {
                        throw new Exception("Incorrect username or password", ex);
                }

                UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
                String jwt = jwtUtil.generateToken(userDetails);

                return ResponseEntity.ok(new AuthenticationResponse(jwt));
        }
}
