package it.jpanik.jCooking.validator;

import it.jpanik.jCooking.dtos.user.CredentialsDto;
import it.jpanik.jCooking.dtos.user.UserDto;
import it.jpanik.jCooking.exceptions.ValidationException;
import org.springframework.stereotype.Service;

@Service
public class AuthValidator extends Validator{
    public void validate (CredentialsDto dto) throws ValidationException {
        checkEmpty(dto.getUsername(), "Username: required field");
        checkLength(dto.getUsername(), 1, 64, "Username: length must be between 1 and 64");
        checkEmpty(dto.getPassword(), "Password: required field");
        checkLength(dto.getPassword(), 1, 64, "Password: length must be between 1 and 64");
    }

    public void validate (UserDto dto) throws ValidationException {
        checkEmpty(dto.getName(), "Name: required field");
        checkLength(dto.getName(), 1, 64, "Surname: length must be between 1 and 64");
        checkLength(dto.getSurname(), 0, 64, "Surname: length must be between 1 and 64");
        checkRange(dto.getAge(), 1, 10, "Age: range must be between 1 and 100");

    }
}
