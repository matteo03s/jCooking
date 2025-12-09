package it.jpanik.jCooking.services;

import it.jpanik.jCooking.dtos.user.UserDto;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.mappers.UserMapper;
import it.jpanik.jCooking.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(
            UserRepository userRepository,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserDto saveOrUpdate (UserDto userDto) {
        LOGGER.debug("Saving user {}", userDto);
        User user = this.userMapper.convertDtoToEntity(userDto);
        user.setCreationDate(LocalDate.now());
        user = this.userRepository.save(user);
        LOGGER.debug("Saving user {}", user);
        return this.userMapper.convertEntityToDto(user);
    }
    public Long getIdByDto (UserDto userDto) {
        LOGGER.debug("Getting id by user {}", userDto);
        return this.userRepository.findByEmail(userDto.getEmail()).getId();
    }

    public UserDto get (Long id) {
        return this.userMapper.convertEntityToDto(
                this.userRepository.findById(id).orElseThrow()
        );
    }
    public UserDto getByUsername (String username) {
        return this.userMapper.convertEntityToDto(
                this.userRepository.findByUsername(username)
        );
    }

    public List<UserDto> getAll() {
        List <User> result = new ArrayList<>();
        this.userRepository.findAll().forEach(result::add);
        return this.userMapper.convertListEntityToListDto(result);
    }

    public List<UserDto> getBest() {
        List<User> users = userRepository.findTopUsers(PageRequest.of(0, 5));
        return userMapper.convertListEntityToListDto(users);
    }

}
