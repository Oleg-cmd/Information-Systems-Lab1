package com.example.system.repositories;

import com.example.system.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

    @Query("SELECT COUNT(a) FROM Address a WHERE a.town.id = :locationId")
    long countAddressesLinkedToLocation(@Param("locationId") Integer locationId);

    @Query("SELECT COUNT(p) FROM Person p WHERE p.location.id = :locationId")
    long countPersonsLinkedToLocation(@Param("locationId") Integer locationId);

    @Query("SELECT COUNT(o) FROM Organization o WHERE o.officialAddress.town.id = :locationId OR o.postalAddress.town.id = :locationId")
    long countOrganizationsLinkedToLocation(@Param("locationId") Integer locationId);
}
