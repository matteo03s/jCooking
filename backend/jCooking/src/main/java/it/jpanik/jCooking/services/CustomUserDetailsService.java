package it.jpanik.jCooking.services;

import it.jpanik.jCooking.entities.Credentials;
import it.jpanik.jCooking.repositories.CredentialsRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CredentialsRepository credentialsRepository;

    public CustomUserDetailsService(CredentialsRepository credentialsRepository) {
        this.credentialsRepository = credentialsRepository;
    }

    //it finds the credentials(username/password) not the entire user(name, surname, email...)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Credentials credentials = credentialsRepository.findByUsername(username);
        if (credentials == null) {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }
        return new org.springframework.security.core.userdetails.User(
                credentials.getUsername(),
                credentials.getPassword(),
                Collections.emptyList()
//                user.getAuthorities()
        );
    }
}
