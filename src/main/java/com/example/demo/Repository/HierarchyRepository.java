package com.example.demo.Repository;

import com.example.demo.dto.HierarchyProjection;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface HierarchyRepository extends JpaRepository<User, Long> {
    List<HierarchyProjection> findAllBy();
    
    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.role = :role")
    int deleteByRole(String role);
}