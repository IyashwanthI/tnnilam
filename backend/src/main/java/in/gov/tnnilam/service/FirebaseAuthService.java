package in.gov.tnnilam.service;

import in.gov.tnnilam.dto.*;
import in.gov.tnnilam.entity.CitizenUser;
import in.gov.tnnilam.entity.CitizenUserProfile;
import in.gov.tnnilam.repository.CitizenUserProfileRepository;
import in.gov.tnnilam.repository.CitizenUserRepository;
import in.gov.tnnilam.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseAuthService {

    private final CitizenUserRepository userRepository;
    private final CitizenUserProfileRepository profileRepository;
    private final FirebaseTokenService firebaseTokenService;
    private final JwtUtil jwtUtil;

    /**
     * Check if mobile/email already registered (called before sending OTP).
     */
    public ApiResponse<Void> checkAvailability(RegisterRequest request) {
        if (userRepository.existsByMobile(request.getMobile())) {
            return ApiResponse.error("Mobile number already registered. Please login.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered.");
        }
        return ApiResponse.ok("Available");
    }

    /**
     * Register a new citizen after Firebase phone OTP verification.
     * Verifies the Firebase ID token, confirms the phone matches, then creates the account.
     */
    @Transactional
    public ApiResponse<AuthResponse> registerWithFirebase(FirebaseRegisterRequest request) {
        // 1. Verify Firebase token
        String verifiedPhone;
        try {
            verifiedPhone = firebaseTokenService.verifyTokenAndGetPhone(request.getFirebaseIdToken());
        } catch (Exception e) {
            return ApiResponse.error("OTP verification failed: " + e.getMessage());
        }

        // 2. Confirm the phone in the token matches what the user submitted
        String verifiedMobile = firebaseTokenService.extractMobile(verifiedPhone);
        if (!request.getMobile().equals(verifiedMobile)) {
            log.warn("Phone mismatch: submitted={}, firebase={}", request.getMobile(), verifiedMobile);
            return ApiResponse.error("Phone number mismatch. Please retry.");
        }

        // 3. Check not already registered
        if (userRepository.existsByMobile(request.getMobile())) {
            return ApiResponse.error("Mobile number already registered. Please login.");
        }

        // 4. Create user
        CitizenUser user = new CitizenUser();
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setEnabled(true); // Phone already verified by Firebase
        user.setAccountNonExpired(true);
        user.setCredentialsNonExpired(true);
        user.setAccountNonLocked(true);
        user.setNoOfFailedAttempts((short) 0);
        user.setOtpSentCount((short) 0);
        user.setCreatedOn(LocalDateTime.now());
        user.setCreatedBy("SELF");
        userRepository.save(user);

        // 5. Create profile
        CitizenUserProfile profile = new CitizenUserProfile();
        profile.setMobile(user.getMobile());
        profile.setEmail(user.getEmail());
        profile.setName(user.getName());
        profile.setCreatedOn(LocalDateTime.now());
        profileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getMobile());
        return ApiResponse.ok("Registration successful",
                new AuthResponse(token, user.getMobile(), user.getName(), user.getEmail(), "Registration successful"));
    }

    /**
     * Login an existing citizen after Firebase phone OTP verification.
     */
    @Transactional
    public ApiResponse<AuthResponse> loginWithFirebase(FirebaseLoginRequest request) {
        // 1. Verify Firebase token
        String verifiedPhone;
        try {
            verifiedPhone = firebaseTokenService.verifyTokenAndGetPhone(request.getFirebaseIdToken());
        } catch (Exception e) {
            return ApiResponse.error("OTP verification failed: " + e.getMessage());
        }

        // 2. Confirm phone matches
        String verifiedMobile = firebaseTokenService.extractMobile(verifiedPhone);
        if (!request.getMobile().equals(verifiedMobile)) {
            return ApiResponse.error("Phone number mismatch. Please retry.");
        }

        // 3. Find user
        CitizenUser user = userRepository.findByMobile(request.getMobile()).orElse(null);
        if (user == null) {
            return ApiResponse.error("Mobile number not registered. Please register first.");
        }
        if (Boolean.FALSE.equals(user.getAccountNonLocked())) {
            return ApiResponse.error("Account is locked. Please contact support.");
        }

        // 4. Update last login
        user.setUpdatedOn(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getMobile());
        return ApiResponse.ok("Login successful",
                new AuthResponse(token, user.getMobile(), user.getName(), user.getEmail(), "Login successful"));
    }
}
