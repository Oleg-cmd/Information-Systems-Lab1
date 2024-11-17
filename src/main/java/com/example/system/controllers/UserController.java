package com.example.system.controllers;

import com.example.system.dto.UserDto;
import com.example.system.entities.User;
import com.example.system.services.UserService;
import com.example.system.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @Autowired
    public UserController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signin")
    public ResponseEntity<UserDto> authenticateUser(@RequestBody UserDto loginRequest) {
        Authentication authentication = userService.authenticate(
                loginRequest.getUsername(), loginRequest.getPassword()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Находим пользователя после аутентификации
        User user = userService.findByUsername(loginRequest.getUsername());
        
        // Создаем объект UserDto для ответа без пароля и с добавленным JWT
        UserDto userDto = new UserDto(
            user.getUsername(),
            null, // Не передаем пароль в ответе
            user.getRole().toString(),
            user.isApproved(),
            null, // Продукты пока оставим null или добавим, если потребуется
            user.getId(),
            jwt // Устанавливаем сгенерированный токен JWT
        );

        return ResponseEntity.ok(userDto);
    }


    @PostMapping("/signup")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setRole(User.Role.valueOf(userDto.getRole().toUpperCase())); // Приведение к верхнему регистру
        user.setApproved(user.getRole() == User.Role.ADMIN ? false : true);

        User savedUser = userService.createUser(user);
        UserDto responseDto = new UserDto(
            savedUser.getUsername(),
            null, // Пароль не возвращаем в ответе
            savedUser.getRole().toString(),
            savedUser.isApproved(),
            null, // Продукты пока оставим null
            savedUser.getId(),
            null // JWT добавляется только при входе
        );

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }


    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN') and principal.approved")
    public ResponseEntity<User> approveUser(@PathVariable Integer id, @RequestParam boolean approve) {
        User user = userService.approveUser(id, approve);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/pendingAdmins")
    @PreAuthorize("hasAuthority('ADMIN') and principal.approved")
    public ResponseEntity<List<User>> getPendingAdmins() {
        List<User> pendingAdmins = userService.getPendingAdmins();
        return new ResponseEntity<>(pendingAdmins, HttpStatus.OK);
    }

}
