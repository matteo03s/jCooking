package it.jpanik.jCooking.dtos.recipes;

import java.util.Objects;

public class RecipeSummaryDto {
    private Long id;
    private String title;

    public RecipeSummaryDto() {}

    public RecipeSummaryDto(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        RecipeSummaryDto that = (RecipeSummaryDto) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title);
    }

    @Override
    public String toString() {
        return "RecipeSummaryDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                '}';
    }
}
