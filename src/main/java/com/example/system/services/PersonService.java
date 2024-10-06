package com.example.system.services;

import com.example.system.entities.Person;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PersonService {

    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person createPerson(Person person) {
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

    public Person updatePerson(Integer id, Person updatedPerson) {
        validatePerson(updatedPerson);
        return personRepository.findById(id)
                .map(person -> {
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

    public void deletePerson(Integer id) {
        personRepository.deleteById(id);
    }

    // Специальные операции (добавьте сюда необходимые запросы из PersonRepository, если нужно)
    // ...

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
        // ... Другие проверки (например, на допустимые значения для enum)
    }
}