package com.example.system.repositories;

import com.example.system.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    // Дополнительные запросы, если необходимо
}