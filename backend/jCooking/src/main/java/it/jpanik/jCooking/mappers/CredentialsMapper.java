package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.user.CredentialsDto;
import it.jpanik.jCooking.entities.Credentials;
import it.jpanik.jCooking.repositories.CredentialsRepository;
import it.jpanik.jCooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CredentialsMapper extends Mapper<CredentialsDto, Credentials> {
    private final CredentialsRepository credentialsRepository;
    private final UserRepository userRepository;

    public CredentialsMapper(
            CredentialsRepository credentialsRepository,
            UserRepository userRepository) {
        this.credentialsRepository = credentialsRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected Credentials convertDtoToEntityImpl(CredentialsDto dto) {
        Credentials entity;

        // 2
        if (dto.getId() != null) {
            entity = this.credentialsRepository.findById(dto.getId()).orElseThrow(); // 4
        } else {
            entity = new Credentials();
//            entity.setCreationDate(LocalDate.now());
//            entity.setCreationUser("Current User");
        }

        // 3
        entity.setUsername(dto.getUsername());
        entity.setPassword(dto.getPassword());
        entity.setUser(userRepository.findById(dto.getUserId()).orElseThrow());
        return entity;
    }

    @Override
    protected CredentialsDto convertEntityToDtoImpl(Credentials entity) {
        CredentialsDto dto = new CredentialsDto();
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setPassword(entity.getPassword());
        return dto;
    }
}
