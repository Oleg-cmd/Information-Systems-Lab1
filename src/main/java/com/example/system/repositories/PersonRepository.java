package com.example.system.repositories;

import com.example.system.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Integer> {
    @Query("SELECT COUNT(p) FROM Product p WHERE p.owner.id = :personId")
    long countProductsByOwnerId(@Param("personId") Integer personId);

    @Query("SELECT COUNT(p) FROM Person p WHERE p.location.id = :locationId")
    long countByLocationId(@Param("locationId") Integer locationId);


    @Query("SELECT p FROM Person p WHERE p.location.id = :locationId")
    List<Person> findAllByLocationId(@Param("locationId") Integer locationId);

    default boolean isPersonLinkedToProducts(Integer personId) {
        return countProductsByOwnerId(personId) > 0;
    }
}