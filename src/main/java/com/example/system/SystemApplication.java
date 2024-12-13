package com.example.system;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EntityScan(basePackages = "com.example.system.entities")
@EnableJpaRepositories(basePackages = "com.example.system.repositories")
@SpringBootApplication
@EnableTransactionManagement
public class SystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SystemApplication.class, args);
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setJpaVendorAdapter(createJpaVendorAdapter());
        em.setJpaPropertyMap(getVendorProperties());
        em.setPersistenceUnitName("myPersistenceUnit");
        em.setDataSource(dataSource);
        em.setPackagesToScan("com.example.system.entities");
        return em;
    }

    private JpaVendorAdapter createJpaVendorAdapter() {
        return new EclipseLinkJpaVendorAdapter();
    }

    private Map<String, Object> getVendorProperties() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("eclipselink.weaving", "false");
        properties.put("eclipselink.logging.level", "INFO");
        properties.put(PersistenceUnitProperties.DDL_GENERATION, PersistenceUnitProperties.CREATE_ONLY);
        // properties.put(PersistenceUnitProperties.DDL_GENERATION_MODE, PersistenceUnitProperties.);
        properties.put("eclipselink.target-database", "PostgreSQL");
        properties.put("eclipselink.schema", "public");
        return properties;
    }

}
