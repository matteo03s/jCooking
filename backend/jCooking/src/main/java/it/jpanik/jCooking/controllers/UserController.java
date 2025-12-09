package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.user.UserDto;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserDto getMe(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        LOGGER.debug("GET /users/{}", principal.getUsername());
        return this.userService.getByUsername(principal.getUsername());
    }

    @GetMapping ("/{username}")
    public UserDto get (@PathVariable String username) {
        LOGGER.debug("GET /users/{}", username);
        return this.userService.getByUsername(username);
    }

    @GetMapping ("/id/{id}")
    public UserDto get (@PathVariable Long id) {
        LOGGER.debug("GET /users/{}", id);
        return this.userService.get(id);
    }

    @PutMapping ("/{id}")
    public ResponseEntity<UserDto> update(
            @PathVariable Long id,
            @RequestBody UserDto userDto,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        LOGGER.debug("PUT /users/{}, {}", id, userDto);

        UserDto existing = userService.get(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        if (!principal.getUsername().equals(userDto.getUsername())
                || !principal.getUsername().equals(existing.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        userDto.setId(id);
        UserDto updated = userService.saveOrUpdate(userDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAll(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        List <UserDto> users = new ArrayList<>(this.userService.getAll());
        UserDto me = this.userService.getByUsername(principal.getUsername());
        users.remove(me);
        return ResponseEntity.ok(users);
    }

    @GetMapping("best")
    public ResponseEntity<List<UserDto>> getBest() {
        List <UserDto> users = new ArrayList<>(this.userService.getBest());
        return ResponseEntity.ok(users);
    }
}


