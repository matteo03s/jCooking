package it.jpanik.jCooking.dtos;

import java.util.Objects;

public class ImageDto {
    private Long id;
    private String urlImage;
    private boolean isPrimary;

    public ImageDto() {
    }

    public ImageDto(Long id, String urlImage, boolean isPrimary) {
        this.id = id;
        this.urlImage = urlImage;
        this.isPrimary = isPrimary;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrlImage() {
        return urlImage;
    }

    public void setUrlImage(String urlImage) {
        this.urlImage = urlImage;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ImageDto imageDto = (ImageDto) o;
        return isPrimary == imageDto.isPrimary && Objects.equals(id, imageDto.id) && Objects.equals(urlImage, imageDto.urlImage);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, urlImage, isPrimary);
    }

    @Override
    public String toString() {
        return "ImageDto{" +
                "id=" + id +
                ", urlImage='" + urlImage + '\'' +
                ", isPrimary=" + isPrimary +
                '}';
    }
}
