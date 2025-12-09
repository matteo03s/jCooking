package it.jpanik.jCooking.dtos.user;

public class CredentialsDto {

    private Long id;
    private String username;
    private String password;
    private Long userId;

    public CredentialsDto(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
    public CredentialsDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "CredentialsDto{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
