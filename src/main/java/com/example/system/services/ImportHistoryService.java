package com.example.system.services;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.system.entities.ImportHistory;
import com.example.system.repositories.ImportHistoryRepository;

@Service
public class ImportHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(OrganizationService.class);
    private final ImportHistoryRepository importHistoryRepository;

    @Autowired
    public ImportHistoryService(ImportHistoryRepository importHistoryRepository) {
        this.importHistoryRepository = importHistoryRepository;
    }

    // Сохраняем историю импорта
    public void saveImportHistory(int userId, int successCount) {
        ImportHistory history = new ImportHistory();
        history.setUserId(userId);
        history.setStatus("SUCCESS");  // Можете добавить статус "ERROR", если нужно
        history.setSuccessCount(successCount);
        history.setTimestamp(new Date());
        logger.info("saving history");
        importHistoryRepository.save(history);  // Сохраняем в базу данных
        logger.info("history saved");
    }

    // Можно добавить методы для получения истории, например:
    public List<ImportHistory> getImportHistory() {
        return importHistoryRepository.findAll();
    }

    // Пример для получения истории конкретного пользователя
    public List<ImportHistory> getImportHistoryByUserId(int userId) {
        return importHistoryRepository.findByUserId(userId);
    }
}
