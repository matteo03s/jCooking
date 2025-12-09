package it.jpanik.jCooking.entities;

import jakarta.persistence.*;

@Entity
@Table(name="CREDENTIALS")
public class Credentials {
    @Column (name = "ID")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column (unique = true, name = "USERNAME")
    private String username;
    @Column (name = "PASSWORD")
    private String password;
    //private java.util.Collection <? extends org.springframework.security.core.GrantedAuthority> authorities;

    @OneToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
    private User user;

    public Credentials(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public Credentials() {

    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
