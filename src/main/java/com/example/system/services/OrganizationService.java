package com.example.system.services;

import com.example.system.entities.Organization;
import com.example.system.entities.Address;
import com.example.system.entities.Location;
import com.example.system.entities.User;
import com.example.system.exceptions.ForbiddenOperationException;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.OrganizationRepository;
import com.example.system.repositories.AddressRepository;
import com.example.system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.system.repositories.*;

import java.util.List;

@Service
@Transactional
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;


    @Autowired
    public OrganizationService(
            OrganizationRepository organizationRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.organizationRepository = organizationRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Organization createOrganization(Organization organization, Integer currentUserId) {
        organization.setCreatedBy(currentUserId);

        // Process addresses
        Address officialAddress = processAddress(
                organization.getCreateOfficialAddress(),
                organization.getLinkOfficialAddressId()
        );
        organization.setOfficialAddress(officialAddress);

        Address postalAddress = processAddress(
                organization.getCreatePostalAddress(),
                organization.getLinkPostalAddressId()
        );
        organization.setPostalAddress(postalAddress);

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

    public Organization updateOrganization(Integer id, Organization updatedOrganization, Integer currentUserId) {
        return organizationRepository.findById(id)
                .map(existingOrganization -> {
                    if (!existingOrganization.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
                        throw new ForbiddenOperationException("У вас нет прав для изменения этой организации.");
                    }

                    // Process addresses
                    Address officialAddress = processAddress(
                            updatedOrganization.getCreateOfficialAddress(),
                            updatedOrganization.getLinkOfficialAddressId()
                    );
                    existingOrganization.setOfficialAddress(officialAddress);

                    Address postalAddress = processAddress(
                            updatedOrganization.getCreatePostalAddress(),
                            updatedOrganization.getLinkPostalAddressId()
                    );
                    existingOrganization.setPostalAddress(postalAddress);

                    // Update organization details
                    validateOrganization(updatedOrganization);
                    existingOrganization.setName(updatedOrganization.getName());
                    existingOrganization.setAnnualTurnover(updatedOrganization.getAnnualTurnover());
                    existingOrganization.setEmployeesCount(updatedOrganization.getEmployeesCount());
                    existingOrganization.setFullName(updatedOrganization.getFullName());
                    existingOrganization.setRating(updatedOrganization.getRating());

                    return organizationRepository.save(existingOrganization);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Организация с ID " + id + " не найдена"));
    }

    public void deleteOrganization(Integer id, Integer currentUserId) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Организация с ID " + id + " не найдена"));

        if (!organization.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
            throw new ForbiddenOperationException("У вас нет прав для удаления этой организации.");
        }

        // Подготовка данных для проверки
        Address officialAddress = organization.getOfficialAddress();
        Address postalAddress = organization.getPostalAddress();

        boolean shouldDeleteOfficialAddress = false;
        boolean shouldDeletePostalAddress = false;

        // Проверяем возможность удаления адресов
        if (officialAddress != null) {
            shouldDeleteOfficialAddress = organizationRepository.countByAddressId(officialAddress.getId()) == 1 &&
                                        productRepository.countByAddressId(officialAddress.getId()) == 0;
        }
        if (postalAddress != null) {
            shouldDeletePostalAddress = organizationRepository.countByAddressId(postalAddress.getId()) == 1 &&
                                        productRepository.countByAddressId(postalAddress.getId()) == 0;
        }

        // Убираем связи с организацией
        organization.setOfficialAddress(null);
        organization.setPostalAddress(null);
        organizationRepository.save(organization);

        // Удаляем организацию
        organizationRepository.deleteById(id);

        // Удаляем адреса, если они больше ни с чем не связаны
        if (shouldDeleteOfficialAddress) {
            addressRepository.deleteById(officialAddress.getId());
        }
        if (shouldDeletePostalAddress) {
            addressRepository.deleteById(postalAddress.getId());
        }
    }



    private void deleteAddressIfUnlinked(Address address) {
        if (address != null &&
            addressRepository.countOrganizationsLinkedToAddress(address.getId()) == 0 &&
            addressRepository.countProductsLinkedToAddress(address.getId()) == 0 &&
            addressRepository.countLocationsLinkedToAddress(address.getId()) == 0) {
            addressRepository.deleteById(address.getId());
        }
    }

    public Double getAverageRating() {
        return organizationRepository.getAverageRating();
    }

    private Address processAddress(Address createAddress, Integer linkAddressId) {
        if (createAddress != null) {
            if (createAddress.getCreateTown() != null) {
                // Create new Location
                Location newLocation = new Location(
                        createAddress.getCreateTown().getX(),
                        createAddress.getCreateTown().getY(),
                        createAddress.getCreateTown().getZ()
                );
                createAddress.setTown(newLocation);
            }
            return addressRepository.save(createAddress);
        } else if (linkAddressId != null) {
            return addressRepository.findById(linkAddressId)
                    .orElseThrow(() -> new ResourceNotFoundException("Адрес с ID " + linkAddressId + " не найден"));
        }
        return null;
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

    private boolean isAdmin(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + userId + " не найден"));

        return user.getRole() == User.Role.ADMIN && user.isApproved();
    }
}
