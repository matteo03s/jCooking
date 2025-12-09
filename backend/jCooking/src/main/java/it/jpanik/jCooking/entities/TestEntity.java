package it.jpanik.jCooking.entities;

import jakarta.persistence.*;

@Entity // 1
@SequenceGenerator(name = "TEST_SEQUENCE_GENERATOR", allocationSize = 1, sequenceName = "TEST_SEQ") // 2
@Table(name = "TEST") // 3
public class TestEntity {

    @Column(name = "ID") // 4
    @Id // 5
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "TEST_SEQUENCE_GENERATOR") // 6
    private Long id;

    @Column(name = "NAME", nullable = false, length = 64)
    private String name;

    @Column(name = "SURNAME", nullable = false, length = 64)
    private String surname;

    // 7
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

}
