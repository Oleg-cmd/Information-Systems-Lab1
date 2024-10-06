package com.example.system.repositories;

import com.example.system.entities.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    long countByPartNumber(String partNumber);

    List<Product> findByPartNumberStartingWith(String partNumberPrefix);

    List<Product> findByPriceBetween(long minPrice, long maxPrice);

    List<Product> findByUnitOfMeasure(UnitOfMeasure unitOfMeasure);
}