package com.example.demo.Controller;

import com.example.demo.model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.UserProjection;



// ADD THIS CORRECT IMPORT:
import java.util.Optional; // This is the correct Optional for Java collections and Spring Data

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserProjection> getUsersWithNameAndAgeAndEmail() {
        return userRepository.findAllByOrderByIdAsc();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Debug: Print received user data
            System.out.println("Received user: " + user.toString());

            // Validate required fields
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            User savedUser = userRepository.save(user);
            System.out.println("Saved user: " + savedUser.toString());
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Error creating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            // Check if the user exists before attempting to delete
            // The Optional class from java.util is used here
            Optional<User> userOptional = userRepository.findById(id);
            if (userOptional.isPresent()) {
                userRepository.deleteById(id);
                System.out.println("User with ID " + id + " deleted successfully.");
                return ResponseEntity.ok("User deleted successfully.");
            } else {
                System.out.println("User with ID " + id + " not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
            }
        } catch (Exception e) {
            System.err.println("Error deleting user with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }
   @PutMapping("/{id}")
public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
    User existingUser = userRepository.findById(id)
        .orElseThrow();
    
    // Update only specific fields
    existingUser.setName(updatedUser.getName());
    existingUser.setAge(updatedUser.getAge());
    existingUser.setEmail(updatedUser.getEmail());
    
    User savedUser = userRepository.save(existingUser);
    return ResponseEntity.ok(savedUser);
}

}