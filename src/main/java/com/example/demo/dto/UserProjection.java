package com.example.demo.dto;

public interface UserProjection {
  Long getId();
    String getName();
    String getEmail();
   int getAge(); 
     String getRole();       // Add this
    String getDescription(); // Add this
}
