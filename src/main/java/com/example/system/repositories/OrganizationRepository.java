package com.example.system.repositories;

import com.example.system.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Integer> {

    @Query("SELECT o FROM Organization o WHERE o.officialAddress.id = :addressId OR o.postalAddress.id = :addressId")
    List<Organization> findAllByOfficialAddressIdOrPostalAddressId(@Param("addressId") Integer addressId);

    @Query("SELECT COUNT(o) FROM Organization o WHERE o.officialAddress.id = :addressId OR o.postalAddress.id = :addressId")
    long countByAddressId(@Param("addressId") Integer addressId);

    @Query("SELECT AVG(o.rating) FROM Organization o")
    Double getAverageRating();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.manufacturer.id = :organizationId")
    long countProductsLinkedToOrganization(@Param("organizationId") Integer organizationId);
}
