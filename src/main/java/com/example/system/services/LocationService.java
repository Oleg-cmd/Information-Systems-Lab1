package com.example.system.services;

import com.example.system.entities.Location;
import com.example.system.entities.User;
import com.example.system.entities.Address;
import com.example.system.entities.Person;


import com.example.system.exceptions.ForbiddenOperationException;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.LocationRepository;
import com.example.system.repositories.UserRepository;
import com.example.system.repositories.PersonRepository;
import com.example.system.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LocationService {

    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PersonRepository personRepository;

    public LocationService(LocationRepository locationRepository, 
                       UserRepository userRepository,
                       AddressRepository addressRepository,
                       PersonRepository personRepository) {
    this.locationRepository = locationRepository;
    this.userRepository = userRepository;
    this.addressRepository = addressRepository;
    this.personRepository = personRepository;
                       }

    public Location createLocation(Location location, Integer currentUserId) {
        location.setCreatedBy(currentUserId); // Set the creator ID
        validateLocation(location);
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Integer id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Местоположение с ID " + id + " не найдено"));
    }

    public Location updateLocation(Integer id, Location updatedLocation, Integer currentUserId) {
        validateLocation(updatedLocation);
        return locationRepository.findById(id)
                .map(existingLocation -> {
                    if (!existingLocation.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
                        throw new ForbiddenOperationException("У вас нет прав для изменения этого местоположения.");
                    }
                    existingLocation.setX(updatedLocation.getX());
                    existingLocation.setY(updatedLocation.getY());
                    existingLocation.setZ(updatedLocation.getZ());
                    return locationRepository.save(existingLocation);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Местоположение с ID " + id + " не найдено"));
    }

   public void deleteLocation(Integer id, Integer currentUserId) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Местоположение с ID " + id + " не найдено"));

        if (!location.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
            throw new ForbiddenOperationException("У вас нет прав для удаления этого местоположения.");
        }

        // Подготовка данных для проверки
        List<Address> addresses = addressRepository.findAllByTownId(id);
        List<Person> persons = personRepository.findAllByLocationId(id);

        boolean canDeleteLocation = true;

        // Проверяем адреса
        for (Address address : addresses) {
            if (addressRepository.countByTownId(address.getId()) > 1) {
                canDeleteLocation = false;
                break;
            }
        }

        // Проверяем людей
        for (Person person : persons) {
            if (personRepository.countByLocationId(person.getLocation().getId()) > 1) {
                canDeleteLocation = false;
                break;
            }
        }

        if (!canDeleteLocation) {
            throw new ForbiddenOperationException("Местоположение связано с другими объектами и не может быть удалено.");
        }

        // Убираем связи с адресами
        for (Address address : addresses) {
            address.setTown(null);
            addressRepository.save(address);
        }

        // Убираем связи с людьми
        for (Person person : persons) {
            person.setLocation(null);
            personRepository.save(person);
        }

        // Удаляем локацию
        locationRepository.deleteById(id);
    }





    private void validateLocation(Location location) {
        if (location.getY() == null) {
            throw new IllegalArgumentException("Координата Y локации не может быть null");
        }
        if (location.getZ() == null) {
            throw new IllegalArgumentException("Координата Z локации не может быть null");
        }
    }

    private boolean isAdmin(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + userId + " не найден"));
        
        if(user.getRole() == User.Role.ADMIN && user.isApproved()){
            return true;
        }

        return false;
    }
}
