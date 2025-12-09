package it.jpanik.jCooking.dtos.review;

import java.util.Objects;

public class UserSummaryDto {
    private Long id;
    private String username;
    private String avatarUrl;

    public UserSummaryDto() {
    }

    public UserSummaryDto(Long id, String username, String avatarUrl) {
        this.id = id;
        this.username = username;
        this.avatarUrl = avatarUrl;
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

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserSummaryDto that = (UserSummaryDto) o;
        return Objects.equals(id, that.id) && Objects.equals(username, that.username) && Objects.equals(avatarUrl, that.avatarUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, avatarUrl);
    }

    @Override
    public String toString() {
        return "UserSummaryDto{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", avatarUrl='" + avatarUrl + '\'' +
                '}';
    }
}