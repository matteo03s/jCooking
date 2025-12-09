package it.jpanik.jCooking.services;

import it.jpanik.jCooking.dtos.FriendshipDto;
import it.jpanik.jCooking.entities.Enums.FriendshipStatus;
import it.jpanik.jCooking.entities.Friendship;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.exceptions.AlreadyExistingException;
import it.jpanik.jCooking.mappers.FriendshipMapper;
import it.jpanik.jCooking.repositories.FriendshipRepository;
import it.jpanik.jCooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final FriendshipMapper friendshipMapper;

    FriendshipService(
            FriendshipRepository friendshipRepository,
            UserRepository userRepository,
            FriendshipMapper friendshipMapper
    ) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.friendshipMapper = friendshipMapper;
    }

    public FriendshipDto sendFriendRequest(String senderUsername, Long receiverId) {
        User sender = userRepository.findByUsername(senderUsername);
//                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

/*        if (friendshipRepository.findBySenderAndReceiver(sender, receiver).isPresent()
        || friendshipRepository.findBySenderAndReceiver(receiver, sender).isPresent()) {
        if (this.friendshipRepository.existsBySenderAndReceiver(sender, receiver)
        || this.friendshipRepository.existsBySenderAndReceiver(receiver, sender)) {
            throw new AlreadyExistingException("Friend request already sent or exists");
        }
*/      Friendship trial = friendshipRepository.findFriendshipBetween(sender.getId(), receiver.getId()).orElse(null);
        if (trial != null && trial.getStatus() != FriendshipStatus.DECLINED) {
            throw new AlreadyExistingException("Friend request already sent or exists");
        }

        Friendship friendship = new Friendship();
        friendship.setSender(sender);
        friendship.setReceiver(receiver);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(LocalDateTime.now());

        friendship = friendshipRepository.save(friendship);
        return friendshipMapper.convertEntityToDto(friendship);
    }

    public FriendshipDto respondToRequest(String receiverUsername, Long requestId, boolean accept) {
        User receiver = userRepository.findByUsername(receiverUsername);
//                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!friendship.getReceiver().equals(receiver)) {
            throw new AlreadyExistingException("You are not authorized to respond to this request");
        }

        friendship.setStatus(accept ? FriendshipStatus.ACCEPTED : FriendshipStatus.DECLINED);
        friendship = this.friendshipRepository.save(friendship);
        return this.friendshipMapper.convertEntityToDto(friendship);
    }

    public List<FriendshipDto> getPendingRequests (String username) {
        User receiver = userRepository.findByUsername(username);
//                .orElseThrow(() -> new RuntimeException("User not found"));
        List <Friendship> result = new ArrayList<>();
        this.friendshipRepository.findByUserAndStatus(receiver, FriendshipStatus.PENDING).forEach(result::add);
        return this.friendshipMapper.convertListEntityToListDto(result);
    }
    public List<FriendshipDto> getReceivedRequests (String username) {
        User receiver = userRepository.findByUsername(username);
//                .orElseThrow(() -> new RuntimeException("User not found"));
        List <Friendship> result = new ArrayList<>();
        this.friendshipRepository.findByReceiverAndStatus(receiver, FriendshipStatus.PENDING).forEach(result::add);
        return this.friendshipMapper.convertListEntityToListDto(result);
    }
    public List<FriendshipDto> getSentRequests (String username) {
        User sender = userRepository.findByUsername(username);
//                .orElseThrow(() -> new RuntimeException("User not found"));
        List <Friendship> result = new ArrayList<>();
        this.friendshipRepository.findBySenderAndStatus(sender, FriendshipStatus.PENDING).forEach(result::add);
        return this.friendshipMapper.convertListEntityToListDto(result);
    }

    public List<FriendshipDto> getFriends(String username) {
        User user = userRepository.findByUsername(username);
//                .orElseThrow(() -> new RuntimeException("User not found"));
        List <Friendship> result = new ArrayList<>();
        this.friendshipRepository.findByUserAndStatus(user, FriendshipStatus.ACCEPTED).forEach(result::add);
        return this.friendshipMapper.convertListEntityToListDto(result);
    }
}
