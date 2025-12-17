package com.example.demo.Repository;


import com.example.demo.dto.UserProjection;
import com.example.demo.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    List<UserProjection> findAllByOrderByIdAsc(); 
}