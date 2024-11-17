package com.example.system.repositories;

import com.example.system.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    @Query("SELECT a FROM Address a WHERE a.town.id = :townId")
    List<Address> findAllByTownId(@Param("townId") Integer townId);

    @Query("SELECT COUNT(a) FROM Address a WHERE a.town.id = :townId")
    long countByTownId(@Param("townId") Integer townId);

    @Query("SELECT COUNT(o) FROM Organization o WHERE o.officialAddress.id = :addressId OR o.postalAddress.id = :addressId")
    long countByAddressId(@Param("addressId") Integer addressId);


    @Query("SELECT COUNT(o) FROM Organization o WHERE o.officialAddress.id = :addressId OR o.postalAddress.id = :addressId")
    long countOrganizationsLinkedToAddress(@Param("addressId") Integer addressId);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.manufacturer.id = :addressId")
    long countProductsLinkedToAddress(@Param("addressId") Integer addressId);

    @Query("SELECT COUNT(l) FROM Location l WHERE l.id = :addressId")
    long countLocationsLinkedToAddress(@Param("addressId") Integer addressId);
}
