package com.jpmc.coffeeshop.service;

import com.jpmc.coffeeshop.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User createUser(User user);
    void deleteUser(Long id);
}
