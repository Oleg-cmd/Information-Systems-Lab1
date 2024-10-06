package com.example.system.repositories;

import com.example.system.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PersonRepository extends JpaRepository<Person, Integer> {
    // Дополнительные запросы, если необходимо
}