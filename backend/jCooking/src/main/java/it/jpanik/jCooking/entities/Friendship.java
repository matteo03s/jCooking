package it.jpanik.jCooking.entities;

import it.jpanik.jCooking.entities.Enums.FriendshipStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "FRIENDSHIP",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"SENDER_ID", "RECEIVER_ID"})
        }
)
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name="ID")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn (name="SENDER_ID")
    private User sender;

    @ManyToOne(optional = false)
    @JoinColumn (name="RECEIVER_ID")
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "STATUS")
    private FriendshipStatus status;

    @Column (name = "CREATION_DATE")
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public FriendshipStatus getStatus() {
        return status;
    }

    public void setStatus(FriendshipStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
