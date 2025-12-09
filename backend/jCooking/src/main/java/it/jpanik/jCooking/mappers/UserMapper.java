package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.user.UserDto;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserMapper extends Mapper<UserDto, User> {

    private final UserRepository userRepository;

    public UserMapper(
            UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected User convertDtoToEntityImpl(UserDto dto) {
        User entity;
        if (dto.getId() != null) {
            entity = this.userRepository.findById(dto.getId()).orElseThrow(); // 4
        } else {
            entity = new User();
//            entity.setCreationDate(LocalDate.now());
//            entity.setCreationUser("Current User");
        }
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setName(dto.getName());
        entity.setSurname(dto.getSurname());
        entity.setAge(dto.getAge());
        entity.setGender(dto.getGender());
        entity.setAvatar(dto.getAvatar());

        return entity;
    }

    @Override
    protected UserDto convertEntityToDtoImpl(User entity) {
        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setUsername(entity.getUsername());
        dto.setName(entity.getName());
        dto.setSurname(entity.getSurname());
        dto.setAge(entity.getAge());
        dto.setGender(entity.getGender());
        dto.setAvatar(entity.getAvatar());

        Set<Recipe> temp =  entity.getRecipes();
        if (temp != null) {
            int quantity = temp.size();
            dto.setRecipesCount(quantity);
        } else {
            dto.setRecipesCount(0);
        }
        return dto;
    }
}
