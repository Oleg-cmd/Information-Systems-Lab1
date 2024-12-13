package com.example.system.services;

import com.example.system.entities.User;
import com.example.system.entities.Address;
import com.example.system.entities.Location;
import com.example.system.entities.Organization;
import com.example.system.exceptions.ForbiddenOperationException;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.AddressRepository;
import com.example.system.repositories.LocationRepository;
import com.example.system.repositories.UserRepository;
import com.example.system.repositories.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository,
            LocationRepository locationRepository,
            UserRepository userRepository,
            OrganizationRepository organizationRepository
    ) {
        this.addressRepository = addressRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    public Address createAddress(Address address, Integer currentUserId) {
        processLocation(address, currentUserId);
        address.setCreatedBy(currentUserId); // Устанавливаем ID текущего пользователя
        return addressRepository.save(address);
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    public Address getAddressById(Integer id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Адрес с ID " + id + " не найден"));
    }

    public Address updateAddress(Integer id, Address updatedAddress, Integer currentUserId) {
        return addressRepository.findById(id)
                .map(existingAddress -> {
                    if (!existingAddress.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
                        throw new ForbiddenOperationException("У вас нет прав для изменения этого адреса.");
                    }
                    existingAddress.setZipCode(updatedAddress.getZipCode());
                    processLocation(updatedAddress, currentUserId);
                    existingAddress.setTown(updatedAddress.getTown());
                    return addressRepository.save(existingAddress);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Адрес с ID " + id + " не найден"));
    }

    @Transactional
    public void deleteAddress(Integer id, Integer currentUserId) {
        // Проверяем, существует ли адрес
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Адрес с ID " + id + " не найден"));

        // Проверка прав доступа: только создатель адреса или администратор может его удалить
        if (!address.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
            throw new ForbiddenOperationException("У вас нет прав для удаления этого адреса.");
        }

        // Удаляем адрес. При наличии каскадного удаления все связанные объекты также будут удалены
        addressRepository.deleteById(id);
    }

    private void deleteAddressIfUnlinked(Address address, Integer currentUserId) {
        if (address != null
                && addressRepository.countOrganizationsLinkedToAddress(address.getId()) == 0
                && addressRepository.countProductsLinkedToAddress(address.getId()) == 0
                && addressRepository.countLocationsLinkedToAddress(address.getId()) == 0) {
            addressRepository.deleteById(address.getId());
        }
    }

    private void processLocation(Address address, Integer currentUserId) {
        if (address.getCreateTown() != null) {
            // Создание нового Location
            Location newLocation = locationRepository.save(address.getCreateTown());
            newLocation.setCreatedBy(currentUserId);
            address.setTown(newLocation);
        } else if (address.getLinkTownId() != null) {
            // Привязка существующего Location
            Location existingLocation = locationRepository.findById(address.getLinkTownId())
                    .orElseThrow(() -> new ResourceNotFoundException("Локация с ID " + address.getLinkTownId() + " не найдена"));
            address.setTown(existingLocation);
        }
    }

    private boolean isAdmin(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + userId + " не найден"));

        if (user.getRole() == User.Role.ADMIN && user.isApproved()) {
            return true;
        }

        return false;
    }
}
