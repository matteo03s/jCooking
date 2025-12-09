package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.user.CredentialsDto;
import it.jpanik.jCooking.dtos.user.RegisterDto;
import it.jpanik.jCooking.dtos.user.UserDto;
import it.jpanik.jCooking.entities.Credentials;
import it.jpanik.jCooking.exceptions.ValidationException;
import it.jpanik.jCooking.security.JwtUtil;
import it.jpanik.jCooking.services.CredentialsService;
//import it.jpanik.jCooking.services.EmailService;
import it.jpanik.jCooking.services.UserService;
import it.jpanik.jCooking.validator.AuthValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

    private final AuthenticationManager authenticationManager;
    private final CredentialsService credentialsService;
    private final UserService userService;
//    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final AuthValidator authValidator;

    @Autowired
    public AuthenticationController(
            AuthenticationManager authenticationManager,
            CredentialsService credentialsService,
            UserService userService,
//            EmailService emailService,
            JwtUtil jwtUtil,
            AuthValidator authValidator
    ) {
        this.authenticationManager = authenticationManager;
        this.credentialsService = credentialsService;
        this.userService = userService;
//        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        this.authValidator = authValidator;
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> authenticationUser(@RequestBody Credentials credentials) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        credentials.getUsername(),
                        credentials.getPassword()
                )
        );
        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    /*
    @PostMapping ("/signin")
    public String authenticationUser (
            @RequestBody Credentials credentials) {
        Authentication authentication = authenticationManager.authenticate(
              new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                      credentials.getUsername(),
                      credentials.getPassword()
              )
        );
        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtil.generateToken(userDetails.getUsername());
    }
*/
    @PostMapping ("/signup")
    public ResponseEntity<?> registerUser (
            @RequestBody RegisterDto registerDto)
            throws ValidationException {
        CredentialsDto credentialsDto = registerDto.getCredentials();
        UserDto userDto = registerDto.getUser();

        if (credentialsService.existsByUsername(credentialsDto.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "User already exists!"));
        }
        LOGGER.debug ("POST /user/{}", userDto);
    //    this.authValidator.validate(userDto);
        userDto.setUsername(credentialsDto.getUsername());
        this.userService.saveOrUpdate(userDto);
        Long userId = this.userService.getIdByDto(userDto);
        credentialsDto.setUserId(userId);
        LOGGER.debug ("POST /credentials/{}", credentialsDto);
    //    this.authValidator.validate(credentialsDto);
        this.credentialsService.saveOrUpdate(credentialsDto);
//        emailService.sendRegistrationConfirmation(registerDto.getUser().getEmail(), registerDto.getUser().getUsername());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully!"));
    }

}
