package it.jpanik.jCooking.dtos.user;

public class RegisterDto {
    private CredentialsDto credentials;
    private UserDto user;

    public CredentialsDto getCredentials() {
        return credentials;
    }

    public void setCredentials(CredentialsDto credentials) {
        this.credentials = credentials;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
