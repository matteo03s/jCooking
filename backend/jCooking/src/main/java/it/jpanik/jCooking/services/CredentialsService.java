package it.jpanik.jCooking.services;

import it.jpanik.jCooking.dtos.user.CredentialsDto;
import it.jpanik.jCooking.entities.Credentials;
import it.jpanik.jCooking.mappers.CredentialsMapper;
import it.jpanik.jCooking.repositories.CredentialsRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CredentialsService {
    private final CredentialsRepository credentialsRepository;
    private final CredentialsMapper credentialsMapper;
    private final PasswordEncoder encoder;

    public CredentialsService (
            CredentialsRepository credentialsRepository,
            CredentialsMapper credentialsMapper,
            PasswordEncoder encoder) {
        this.credentialsRepository = credentialsRepository;
        this.credentialsMapper = credentialsMapper;
        this.encoder = encoder;
    }

    public CredentialsDto saveOrUpdate (CredentialsDto credentialsDto) {
        credentialsDto.setPassword(encoder.encode(credentialsDto.getPassword()));
        Credentials credentials = this.credentialsMapper.convertDtoToEntity(credentialsDto);
        credentials = this.credentialsRepository.save(credentials);
        return this.credentialsMapper.convertEntityToDto(credentials);
    }

    public Credentials getByUsername (String username) {
        return this.credentialsRepository.findByUsername(username);
    }
    public boolean exists (Long id) {
        return this.credentialsRepository.existsById(id);
    }

    public boolean existsByUsername (String username) {
        return this.credentialsRepository.existsByUsername(username);
    }
}
