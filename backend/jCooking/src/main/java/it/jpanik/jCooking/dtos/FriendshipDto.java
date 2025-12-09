package it.jpanik.jCooking.dtos;

import it.jpanik.jCooking.entities.Enums.FriendshipStatus;

import java.time.LocalDateTime;
import java.util.Objects;

public class FriendshipDto {
    private Long id;
    private String senderName;
    private String senderAvatar;
    private Long senderId;
    private String receiverName;
    private String receiverAvatar;
    private Long receiverId;
    private FriendshipStatus status;
    private LocalDateTime createdAt;

    public FriendshipDto() {
    }

    public FriendshipDto(Long id, String senderName, Long senderId, String receiverName, Long receiverId, FriendshipStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.senderName = senderName;
        this.senderId = senderId;
        this.receiverName = receiverName;
        this.receiverId = receiverId;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderAvatar() {
        return senderAvatar;
    }

    public void setSenderAvatar(String senderAvatar) {
        this.senderAvatar = senderAvatar;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public  String getReceiverAvatar() {
        return receiverAvatar;
    }

    public void setReceiverAvatar(String receiverAvatar) {
        this.receiverAvatar = receiverAvatar;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
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

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        FriendshipDto that = (FriendshipDto) o;
        return Objects.equals(id, that.id) && Objects.equals(senderName, that.senderName) && Objects.equals(senderId, that.senderId) && Objects.equals(receiverName, that.receiverName) && Objects.equals(receiverId, that.receiverId) && status == that.status && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, senderName, senderId, receiverName, receiverId, status, createdAt);
    }

    @Override
    public String toString() {
        return "FriendshipDto{" +
                "id=" + id +
                ", senderName='" + senderName + '\'' +
                ", senderId=" + senderId +
                ", receiverName='" + receiverName + '\'' +
                ", receiverId=" + receiverId +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}
