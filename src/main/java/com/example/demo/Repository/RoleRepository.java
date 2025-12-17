package com.example.demo.Repository;

import com.example.demo.dto.RoleProjection;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<User, Long> {
     List<RoleProjection> findAllByOrderByIdAsc();
}