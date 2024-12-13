package com.example.system;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class JpaConfig {

    @Bean
    public DataSource dataSource() {
        // Загрузить переменные из .env
        Dotenv dotenv = Dotenv.load();

        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(dotenv.get("DB_DRIVER"));
        dataSource.setUrl(dotenv.get("DB_URL"));
        dataSource.setUsername(dotenv.get("DB_USERNAME"));
        dataSource.setPassword(dotenv.get("DB_PASSWORD"));
        return dataSource;
    }
}
