package com.example.demo.Controller;

import com.example.demo.Repository.HierarchyRepository;
import com.example.demo.dto.HierarchyProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hierarchy")
public class HierarchyController {

    @Autowired
    private HierarchyRepository hierarchyRepository; 
    
    @GetMapping
    public List<HierarchyProjection> getAllHierarchy() {
        return hierarchyRepository.findAllBy();
    }
    
    @DeleteMapping("/{role}")
    public ResponseEntity<?> deleteByRole(@PathVariable String role) {
        try {
            int deletedCount = hierarchyRepository.deleteByRole(role);
            if (deletedCount > 0) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting hierarchy: " + e.getMessage());
        }
    }
}