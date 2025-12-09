package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.FriendshipDto;
import it.jpanik.jCooking.entities.Enums.FriendshipStatus;
import it.jpanik.jCooking.entities.Friendship;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.repositories.FriendshipRepository;
import it.jpanik.jCooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FriendshipMapper extends Mapper<FriendshipDto, Friendship> {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipMapper(
            final FriendshipRepository friendshipRepository,
            final UserRepository userRepository
    ) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected Friendship convertDtoToEntityImpl(FriendshipDto dto) {
        Friendship entity;
        if (dto.getId() != null) {
            entity = this.friendshipRepository.findById(dto.getId()).orElseThrow();
        }  else {
            entity = new Friendship();
            entity.setCreatedAt(LocalDateTime.now());
        }
        User sender = this.userRepository.findById(dto.getSenderId()).orElseThrow();
        if (sender != null) {
            entity.setSender(sender);
        }
        User receiver = this.userRepository.findById(dto.getReceiverId()).orElseThrow();
        if (receiver != null) {
            entity.setReceiver(receiver);
        }
        FriendshipStatus status = dto.getStatus();
        entity.setStatus(status);
        return entity;
    }

    @Override
    protected FriendshipDto convertEntityToDtoImpl(Friendship entity) {
        if (entity == null) {
            return null;
        }

        FriendshipDto dto = new FriendshipDto();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());

        User sender = entity.getSender();
        if (sender != null) {
            dto.setSenderId(sender.getId());
            dto.setSenderName(sender.getUsername());
            dto.setSenderAvatar(sender.getAvatar());
        }
        User receiver = entity.getReceiver();
        if (receiver != null) {
            dto.setReceiverId(receiver.getId());
            dto.setReceiverName(receiver.getUsername());
            dto.setReceiverAvatar(receiver.getAvatar());
        }
        dto.setStatus(entity.getStatus());
        return dto;
    }
}
