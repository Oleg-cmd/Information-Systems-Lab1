package com.example.system.services;

import com.example.system.entities.Product;
import com.example.system.entities.User;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Пользователь с таким именем уже существует");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == User.Role.ADMIN) {
            user.setApproved(false); // Новые администраторы не утверждены по умолчанию
        } else {
            user.setApproved(true);
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + id + " не найден"));
    }

    public User updateUser(Integer id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(updatedUser.getUsername());
                    user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    user.setRole(updatedUser.getRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + id + " не найден"));
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User authenticate(String username, String password) {
        // Try to find the user by username
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> {
                    // If user doesn't exist, create a new one
                    User newUser = new User();
                    newUser.setUsername(username);
                    newUser.setPassword(password); // Set the password, will be encoded later
                    newUser.setRole(User.Role.USER); // Default to USER role
                    newUser.setApproved(true); // Automatically approve new users
                    return createUser(newUser); // Save the new user
                });

        // Validate the password
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        } else {
            throw new IllegalArgumentException("Неверный пароль");
        }
    }

    public List<Product> findProductsByUserId(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId))
                .getProducts()
                .stream()
                .toList();
    }

    
    public User approveUser(Integer id, boolean approve) {
        User user = getUserById(id);
        user.setApproved(approve);
        return userRepository.save(user);
    }
}
