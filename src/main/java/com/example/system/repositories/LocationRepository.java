package com.example.system.repositories;

import com.example.system.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {
    // Дополнительные запросы, если необходимо
}