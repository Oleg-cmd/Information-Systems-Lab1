package com.example.system.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.system.entities.Location;
import com.example.system.entities.Person;
import com.example.system.entities.User;
import com.example.system.exceptions.ForbiddenOperationException;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.LocationRepository;
import com.example.system.repositories.PersonRepository;
import com.example.system.repositories.UserRepository;

@Service
@Transactional
public class PersonService {

    private static final Logger logger = LoggerFactory.getLogger(OrganizationService.class);
    private final PersonRepository personRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    @Autowired
    public PersonService(PersonRepository personRepository, LocationRepository locationRepository, UserRepository userRepository) {
        this.personRepository = personRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
    }

    public Person createPerson(Person person, Integer currentUserId) {
        person.setCreatedBy(currentUserId); // Set creator ID
        processLocation(person, currentUserId);
        validatePerson(person);
        return personRepository.save(person);
    }

    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public Person getPersonById(Integer id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Человек с ID " + id + " не найден"));
    }

    public Person updatePerson(Integer id, Person updatedPerson, Integer currentUserId) {
        processLocation(updatedPerson, currentUserId);
        validatePerson(updatedPerson);
        return personRepository.findById(id)
                .map(person -> {
                    if (!person.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
                        throw new ForbiddenOperationException("У вас нет прав для изменения данных этого человека.");
                    }
                    person.setName(updatedPerson.getName());
                    person.setEyeColor(updatedPerson.getEyeColor());
                    person.setHairColor(updatedPerson.getHairColor());
                    person.setLocation(updatedPerson.getLocation());
                    person.setBirthday(updatedPerson.getBirthday());
                    person.setNationality(updatedPerson.getNationality());
                    return personRepository.save(person);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Человек с ID " + id + " не найден"));
    }

    public void deletePerson(Integer id, Integer currentUserId) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Человек с ID " + id + " не найден"));

        if (!person.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
            throw new ForbiddenOperationException("У вас нет прав для удаления этого человека.");
        }

        // Удаляем человека
        personRepository.deleteById(id);
    }

    private Location processLocation(Person person, Integer currentUserId) {
        logger.info("proccessing location");
        if (person.getCreateLocation() != null) {
            // Create a new location    
            logger.info("Create a new location for person");

            Location newLocation = person.getCreateLocation();
            newLocation.setCreatedBy(currentUserId);

            logger.info("prepared for saving");

            locationRepository.save(newLocation);

            logger.info("saved");

            return newLocation;

        } else if (person.getLinkLocationId() != null) {
            // Link to an existing location
            return locationRepository.findById(person.getLinkLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Локация с ID " + person.getLinkLocationId() + " не найдена"));

        }
        logger.info("not found");
        return null;
    }

    private void validatePerson(Person person) {
        if (person.getName() == null || person.getName().isEmpty()) {
            throw new IllegalArgumentException("Имя человека не может быть пустым");
        }
        if (person.getHairColor() == null) {
            throw new IllegalArgumentException("Цвет волос человека не может быть null");
        }
        if (person.getLocation() == null) {
            throw new IllegalArgumentException("Местоположение человека не может быть null");
        }
        if (person.getNationality() == null) {
            throw new IllegalArgumentException("Национальность человека не может быть null");
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

    public void flush() {
        personRepository.flush();
    }
}
