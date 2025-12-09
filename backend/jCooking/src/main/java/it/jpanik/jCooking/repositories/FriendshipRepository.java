package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.Enums.FriendshipStatus;
import it.jpanik.jCooking.entities.Friendship;
import it.jpanik.jCooking.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends CrudRepository<Friendship, Long> {

    @Query("""
    SELECT f FROM Friendship f
    WHERE (f.sender = :user OR f.receiver = :user)
      AND f.status = :status
""")
    List<Friendship> findByUserAndStatus(@Param("user") User user, @Param("status") FriendshipStatus status);

    @Query("""
    SELECT f FROM Friendship f
    WHERE (f.receiver = :user)
      AND f.status = :status
""")
    List<Friendship> findByReceiverAndStatus(@Param("user") User user, @Param("status") FriendshipStatus status);

    @Query("""
    SELECT f FROM Friendship f
    WHERE (f.sender = :user)
      AND f.status = :status
""")
    List<Friendship> findBySenderAndStatus(@Param("user") User user, @Param("status") FriendshipStatus status);


//    List<Friendship> findByReceiverAndStatus(User receiver, FriendshipStatus status);
//    List<Friendship> findBySenderAndStatus(User sender, FriendshipStatus status);
    List<Friendship> findBySenderOrReceiverAndStatus(User sender, User receiver, FriendshipStatus status);

    Optional<Friendship> findBySenderAndReceiver(User sender, User receiver);

    boolean existsBySenderIdAndReceiverId(Long senderId, Long receiverId);
    boolean existsBySenderAndReceiver(User sender, User receiver);
    @Query("""
        SELECT f FROM Friendship f 
        WHERE (f.sender.id = :user1Id AND f.receiver.id = :user2Id) 
           OR (f.sender.id = :user2Id AND f.receiver.id = :user1Id)
    """)
    Optional<Friendship> findFriendshipBetween(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}
