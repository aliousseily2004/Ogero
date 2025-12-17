package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private int age;
    private String role;
    private String description; // <--- NEW FIELD ADDED HERE

    public User() {}

    public User(String name, String email, int age, String role, String description) { // <--- ADDED description TO CONSTRUCTOR
        this.name = name;
        this.email = email;
        this.age = age;
        this.role = role;
        this.description = description; // <--- INITIALIZE NEW FIELD
    }

    // Getters and setters for all fields
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // <--- NEW GETTER AND SETTER FOR description
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}