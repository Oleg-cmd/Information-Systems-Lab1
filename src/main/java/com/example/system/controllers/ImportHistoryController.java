package com.example.system.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.system.entities.ImportHistory;
import com.example.system.services.ImportHistoryService;

@RestController
@RequestMapping("/api/import-history")
public class ImportHistoryController {

    private final ImportHistoryService importHistoryService;

    @Autowired
    public ImportHistoryController(ImportHistoryService importHistoryService) {
        this.importHistoryService = importHistoryService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ImportHistory>> getAllImportHistory() {
        List<ImportHistory> history = importHistoryService.getImportHistory();
        return ResponseEntity.ok(history);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ImportHistory>> getImportHistoryByUserId(@PathVariable int userId) {
        List<ImportHistory> history = importHistoryService.getImportHistoryByUserId(userId);
        return ResponseEntity.ok(history);
    }
}
