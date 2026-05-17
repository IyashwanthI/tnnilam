package in.gov.tnnilam.controller;

import in.gov.tnnilam.dto.*;
import in.gov.tnnilam.repository.CitizenUserRepository;
import in.gov.tnnilam.service.AuthService;
import in.gov.tnnilam.service.FirebaseAuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;
    private final FirebaseAuthService firebaseAuthService;
    private final CitizenUserRepository userRepository;

    // ─── Pre-checks (called BEFORE Firebase OTP is triggered) ─────────────────

    /**
     * POST /auth/check
     * Registration pre-check: confirms mobile + email are not already taken.
     * Call this before triggering Firebase OTP for registration.
     */
    @PostMapping("/check")
    public ResponseEntity<ApiResponse<Void>> checkAvailability(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(firebaseAuthService.checkAvailability(request));
    }

    /**
     * GET /auth/check-mobile?mobile=XXXXXXXXXX
     * Login pre-check: confirms the mobile is registered and account is active.
     * Call this before triggering Firebase OTP for login.
     */
    @GetMapping("/check-mobile")
    public ResponseEntity<ApiResponse<Void>> checkMobileRegistered(
            @RequestParam
            @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
            String mobile) {

        var user = userRepository.findByMobile(mobile).orElse(null);

        if (user == null) {
            return ResponseEntity.ok(
                ApiResponse.error("Mobile number not registered. Please register first."));
        }
        if (!Boolean.TRUE.equals(user.getEnabled())) {
            return ResponseEntity.ok(
                ApiResponse.error("Account not verified. Please complete registration."));
        }
        if (Boolean.FALSE.equals(user.getAccountNonLocked())) {
            return ResponseEntity.ok(
                ApiResponse.error("Account is locked. Please contact support."));
        }

        return ResponseEntity.ok(ApiResponse.ok("Mobile is registered"));
    }

    // ─── Firebase-based auth endpoints ────────────────────────────────────────

    /**
     * POST /auth/register/firebase
     * Complete registration after Firebase phone OTP verified on frontend.
     */
    @PostMapping("/register/firebase")
    public ResponseEntity<ApiResponse<AuthResponse>> registerWithFirebase(
            @Valid @RequestBody FirebaseRegisterRequest request) {
        return ResponseEntity.ok(firebaseAuthService.registerWithFirebase(request));
    }

    /**
     * POST /auth/login/firebase
     * Complete login after Firebase phone OTP verified on frontend.
     */
    @PostMapping("/login/firebase")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithFirebase(
            @Valid @RequestBody FirebaseLoginRequest request) {
        return ResponseEntity.ok(firebaseAuthService.loginWithFirebase(request));
    }

    // ─── Legacy OTP endpoints (kept for compatibility) ────────────────────────

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.initiateRegistration(request));
    }

    @PostMapping("/register/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyRegistration(
            @Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyRegistrationOtp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.initiateLogin(request));
    }

    @PostMapping("/login/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyLogin(
            @Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyLoginOtp(request));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Void>> resendOtp(@RequestParam String mobile) {
        return ResponseEntity.ok(authService.resendOtp(mobile));
    }
}
