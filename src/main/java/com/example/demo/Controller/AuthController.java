package com.example.demo.Controller;

import com.example.demo.model.Auth;
import com.example.demo.security.JwtUtil;
import com.example.demo.Repository.AuthRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthRepository authRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection (recommended over @Autowired)
    public AuthController(AuthRepository authRepository, 
                        JwtUtil jwtUtil,
                        PasswordEncoder passwordEncoder) {
        this.authRepository = authRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Auth user) {
        if (authRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        authRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

   @PostMapping("/login")
   
public ResponseEntity<?> login(@RequestBody Auth loginRequest) {
    try {
        System.out.println("LOGIN REQUEST: " + loginRequest.getUsername());

        return authRepository.findByUsername(loginRequest.getUsername())
            .map(user -> {
                System.out.println("Found user: " + user.getUsername());
                boolean match = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
                System.out.println("Password match: " + match);
                if (match) {
                    String token = jwtUtil.generateToken(user.getUsername());
                    return ResponseEntity.ok(token);
                   
                } else {
                    return ResponseEntity.status(401).body("Invalid credentials");
                }
            })
            .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    } catch (Exception e) {
        e.printStackTrace(); // Print full stack trace
        return ResponseEntity.status(500).body("Server error: " + e.getMessage());
    }
}

}