package com.example.system.services;

import com.example.system.entities.Location;
import com.example.system.entities.Person;
import com.example.system.entities.User;
import com.example.system.exceptions.ForbiddenOperationException;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.LocationRepository;
import com.example.system.repositories.PersonRepository;
import com.example.system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PersonService {

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
        processLocation(person);
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
        processLocation(updatedPerson);
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

        // Получаем связанную локацию
        Location location = person.getLocation();

        // Проверяем и удаляем локацию, если она больше ни с чем не связана
        boolean shouldDeleteLocation = location != null &&
                                    locationRepository.countPersonsLinkedToLocation(location.getId()) == 1 &&
                                    locationRepository.countOrganizationsLinkedToLocation(location.getId()) == 0;

        // Удаляем человека
        personRepository.deleteById(id);

        // Удаляем локацию, если нужно
        if (shouldDeleteLocation) {
            locationRepository.deleteById(location.getId());
        }
    }



    private void processLocation(Person person) {
        if (person.getCreateLocation() != null) {
            // Create a new location
            Location newLocation = locationRepository.save(person.getCreateLocation());
            person.setLocation(newLocation);
        } else if (person.getLinkLocationId() != null) {
            // Link to an existing location
            Location existingLocation = locationRepository.findById(person.getLinkLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Локация с ID " + person.getLinkLocationId() + " не найдена"));
            person.setLocation(existingLocation);
        }
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
        
        if(user.getRole() == User.Role.ADMIN && user.isApproved()){
            return true;
        }

        return false;
    }
}
