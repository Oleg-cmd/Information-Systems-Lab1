package com.example.system.services;

import com.example.system.entities.Organization;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public Organization createOrganization(Organization organization) {
        validateOrganization(organization);
        return organizationRepository.save(organization);
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Organization getOrganizationById(Integer id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Организация с ID " + id + " не найдена"));
    }

    public Organization updateOrganization(Integer id, Organization updatedOrganization) {
        validateOrganization(updatedOrganization);
        return organizationRepository.findById(id)
                .map(organization -> {
                    organization.setName(updatedOrganization.getName());
                    organization.setOfficialAddress(updatedOrganization.getOfficialAddress());
                    organization.setAnnualTurnover(updatedOrganization.getAnnualTurnover());
                    organization.setEmployeesCount(updatedOrganization.getEmployeesCount());
                    organization.setFullName(updatedOrganization.getFullName());
                    organization.setRating(updatedOrganization.getRating());
                    organization.setPostalAddress(updatedOrganization.getPostalAddress());
                    return organizationRepository.save(organization);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Организация с ID " + id + " не найдена"));
    }

    public void deleteOrganization(Integer id) {
        organizationRepository.deleteById(id);
    }

    // Специальные операции (добавьте сюда необходимые запросы из OrganizationRepository)
    public Double getAverageRating() {
        return organizationRepository.getAverageRating();
    }

    private void validateOrganization(Organization organization) {
        if (organization.getName() == null || organization.getName().isEmpty()) {
            throw new IllegalArgumentException("Название организации не может быть пустым");
        }
        if (organization.getAnnualTurnover() != null && organization.getAnnualTurnover() <= 0) {
            throw new IllegalArgumentException("Годовой оборот организации должен быть больше 0");
        }
        if (organization.getEmployeesCount() <= 0) {
            throw new IllegalArgumentException("Количество сотрудников организации должно быть больше 0");
        }
        if (organization.getRating() != null && organization.getRating() <= 0) {
            throw new IllegalArgumentException("Рейтинг организации должен быть больше 0");
        }
    }
}