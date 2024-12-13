package com.example.system.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.system.entities.ImportHistory;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Long> {

    public List<ImportHistory> findByUserId(int userId);
}
