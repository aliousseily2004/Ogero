package com.example.demo.Controller;

import com.example.demo.Repository.RoleRepository;
import com.example.demo.dto.RoleProjection;
import com.example.demo.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping; // Keep this import
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping // No specific path here, it inherits "/Role"
    public List<RoleProjection> getUsersWithNameAndRole() {
        return roleRepository.findAllByOrderByIdAsc();
    }
     @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            // Check if the user exists before attempting to delete
            // The Optional class from java.util is used here
            Optional<User> roleOptional = roleRepository.findById(id);
            if (roleOptional.isPresent()) {
                roleRepository.deleteById(id);
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
    User existingUser = roleRepository.findById(id)
        .orElseThrow();
    
    // Update only specific fields
    existingUser.setRole(updatedUser.getRole());
    existingUser.setDescription(updatedUser.getDescription());
   
    
    User savedUser = roleRepository.save(existingUser);
    return ResponseEntity.ok(savedUser);
}

    

}