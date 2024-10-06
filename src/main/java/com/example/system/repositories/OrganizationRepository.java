package com.example.system.repositories;

import com.example.system.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Integer> {
    @Query("SELECT AVG(o.rating) FROM Organization o")
    Double getAverageRating();
}