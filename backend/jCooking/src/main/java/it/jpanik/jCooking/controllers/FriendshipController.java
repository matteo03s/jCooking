package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.FriendshipDto;
import it.jpanik.jCooking.mappers.FriendshipMapper;
import it.jpanik.jCooking.services.FavouriteService;
import it.jpanik.jCooking.services.FriendshipService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/friendships")
public class FriendshipController {

    private static final Logger log = LoggerFactory.getLogger(FriendshipController.class);
    private final FriendshipService friendshipService;

    public FriendshipController(
            FriendshipService friendshipService
    ) {
        this.friendshipService = friendshipService;
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<FriendshipDto> sendFriendRequest(
            @PathVariable Long receiverId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        FriendshipDto dto = friendshipService.sendFriendRequest(
                principal.getUsername(),
                receiverId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{requestId}/respond")
    public ResponseEntity<FriendshipDto> respondToRequest(
            @PathVariable Long requestId,
            @RequestParam boolean accept,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        FriendshipDto dto = this.friendshipService.respondToRequest(principal.getUsername(), requestId, accept);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendshipDto>> getPendingRequests(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        List <FriendshipDto> friendships = this.friendshipService.getPendingRequests(principal.getUsername());
        return ResponseEntity.ok(friendships);
    }

    @GetMapping("/received")
    public ResponseEntity<List<FriendshipDto>> getReceivedRequests(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        List <FriendshipDto> friendships = this.friendshipService.getReceivedRequests(principal.getUsername());
        return ResponseEntity.ok(friendships);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<FriendshipDto>> getSentRequests(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        List <FriendshipDto> friendships = this.friendshipService.getSentRequests(principal.getUsername());
        return ResponseEntity.ok(friendships);
    }

    @GetMapping("/friends")
    public ResponseEntity<List<FriendshipDto>> getFriends(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        log.debug("ciao");
        List <FriendshipDto> friendships = this.friendshipService.getFriends(principal.getUsername());
        log.debug(friendships.toString());
        return ResponseEntity.ok(friendships);
    }
}
