package com.example.system.repositories;

import com.example.system.entities.*;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("SELECT COUNT(p) FROM Product p WHERE p.owner.id = :ownerId")
    long countByOwnerId(@Param("ownerId") Integer ownerId);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.manufacturer.id = :manufacturerId")
    long countByManufacturerId(@Param("manufacturerId") Integer manufacturerId);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.manufacturer.officialAddress.id = :addressId OR p.manufacturer.postalAddress.id = :addressId")
    long countByAddressId(@Param("addressId") Integer addressId);


    long countByPartNumber(String partNumber);

    List<Product> findByPartNumberStartingWith(String partNumberPrefix);

    List<Product> findByPriceBetween(long minPrice, long maxPrice);

    List<Product> findByUnitOfMeasure(UnitOfMeasure unitOfMeasure);
}