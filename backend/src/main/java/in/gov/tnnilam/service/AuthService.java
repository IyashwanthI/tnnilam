package in.gov.tnnilam.service;

import in.gov.tnnilam.dto.*;
import in.gov.tnnilam.entity.CitizenUser;
import in.gov.tnnilam.entity.CitizenUserProfile;
import in.gov.tnnilam.repository.CitizenUserProfileRepository;
import in.gov.tnnilam.repository.CitizenUserRepository;
import in.gov.tnnilam.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final CitizenUserRepository userRepository;
    private final CitizenUserProfileRepository profileRepository;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final int MAX_OTP_SENDS_PER_HOUR = 5;

    /**
     * Step 1 of registration: validate inputs, save user, send OTP.
     */
    @Transactional
    public ApiResponse<Void> initiateRegistration(RegisterRequest request) {
        if (userRepository.existsByMobile(request.getMobile())) {
            return ApiResponse.error("Mobile number already registered. Please login.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered.");
        }

        CitizenUser user = new CitizenUser();
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setEnabled(false);
        user.setAccountNonExpired(true);
        user.setCredentialsNonExpired(true);
        user.setAccountNonLocked(true);
        user.setOtpSentCount((short) 0);
        user.setNoOfFailedAttempts((short) 0);
        user.setCreatedOn(LocalDateTime.now());
        user.setCreatedBy("SELF");

        String otp = otpService.generateOtp();
        user.setCOtp(otp);
        user.setOtpValidity(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        user.setOtpSentCount((short) 1);
        user.setOtpSentTime(LocalDateTime.now());

        userRepository.save(user);
        otpService.sendOtp(request.getMobile(), otp);

        return ApiResponse.ok("OTP sent to " + maskMobile(request.getMobile()));
    }

    /**
     * Step 2 of registration: verify OTP and activate account.
     */
    @Transactional
    public ApiResponse<AuthResponse> verifyRegistrationOtp(OtpVerifyRequest request) {
        CitizenUser user = userRepository.findByMobile(request.getMobile()).orElse(null);

        if (user == null) {
            return ApiResponse.error("Mobile number not found. Please register first.");
        }
        if (Boolean.TRUE.equals(user.getEnabled())) {
            return ApiResponse.error("Account already verified. Please login.");
        }

        ApiResponse<AuthResponse> otpCheck = validateOtp(user, request.getOtp());
        if (otpCheck != null) return otpCheck;

        user.setEnabled(true);
        user.setCOtp(null);
        user.setOtpValidity(null);
        user.setNoOfFailedAttempts((short) 0);
        user.setUpdatedOn(LocalDateTime.now());
        userRepository.save(user);

        // Create profile entry
        CitizenUserProfile profile = new CitizenUserProfile();
        profile.setMobile(user.getMobile());
        profile.setEmail(user.getEmail());
        profile.setName(user.getName());
        profile.setCreatedOn(LocalDateTime.now());
        profileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getMobile());
        AuthResponse authResponse = new AuthResponse(token, user.getMobile(), user.getName(),
                user.getEmail(), "Registration successful");
        return ApiResponse.ok("Registration successful", authResponse);
    }

    /**
     * Step 1 of login: send OTP to registered mobile.
     */
    @Transactional
    public ApiResponse<Void> initiateLogin(LoginRequest request) {
        CitizenUser user = userRepository.findByMobile(request.getMobile()).orElse(null);

        if (user == null) {
            return ApiResponse.error("Mobile number not registered. Please register first.");
        }
        if (!Boolean.TRUE.equals(user.getEnabled())) {
            return ApiResponse.error("Account not verified. Please complete registration.");
        }
        if (Boolean.FALSE.equals(user.getAccountNonLocked())) {
            return ApiResponse.error("Account is locked. Please contact support.");
        }

        // Rate-limit: max 5 OTPs per hour
        if (user.getOtpSentCount() != null && user.getOtpSentCount() >= MAX_OTP_SENDS_PER_HOUR
                && user.getOtpSentTime() != null
                && user.getOtpSentTime().isAfter(LocalDateTime.now().minusHours(1))) {
            return ApiResponse.error("Too many OTP requests. Please try again after 1 hour.");
        }

        String otp = otpService.generateOtp();
        user.setCOtp(otp);
        user.setOtpValidity(LocalDateTime.now().plusMinutes(otpExpiryMinutes));

        short sentCount = (user.getOtpSentTime() != null
                && user.getOtpSentTime().isAfter(LocalDateTime.now().minusHours(1)))
                ? (short) (user.getOtpSentCount() + 1) : (short) 1;
        user.setOtpSentCount(sentCount);
        user.setOtpSentTime(LocalDateTime.now());
        user.setNoOfFailedAttempts((short) 0);
        userRepository.save(user);

        otpService.sendOtp(request.getMobile(), otp);
        return ApiResponse.ok("OTP sent to " + maskMobile(request.getMobile()));
    }

    /**
     * Step 2 of login: verify OTP and return JWT.
     */
    @Transactional
    public ApiResponse<AuthResponse> verifyLoginOtp(OtpVerifyRequest request) {
        CitizenUser user = userRepository.findByMobile(request.getMobile()).orElse(null);

        if (user == null) {
            return ApiResponse.error("Mobile number not registered.");
        }

        ApiResponse<AuthResponse> otpCheck = validateOtp(user, request.getOtp());
        if (otpCheck != null) return otpCheck;

        user.setCOtp(null);
        user.setOtpValidity(null);
        user.setNoOfFailedAttempts((short) 0);
        user.setUpdatedOn(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getMobile());
        AuthResponse authResponse = new AuthResponse(token, user.getMobile(), user.getName(),
                user.getEmail(), "Login successful");
        return ApiResponse.ok("Login successful", authResponse);
    }

    /**
     * Resend OTP for registration or login.
     */
    @Transactional
    public ApiResponse<Void> resendOtp(String mobile) {
        CitizenUser user = userRepository.findByMobile(mobile).orElse(null);
        if (user == null) {
            return ApiResponse.error("Mobile number not found.");
        }

        String otp = otpService.generateOtp();
        user.setCOtp(otp);
        user.setOtpValidity(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        user.setOtpSentCount((short) (user.getOtpSentCount() == null ? 1 : user.getOtpSentCount() + 1));
        user.setOtpSentTime(LocalDateTime.now());
        userRepository.save(user);

        otpService.sendOtp(mobile, otp);
        return ApiResponse.ok("OTP resent to " + maskMobile(mobile));
    }

    // ---- helpers ----

    private <T> ApiResponse<T> validateOtp(CitizenUser user, String inputOtp) {
        if (user.getCOtp() == null || user.getOtpValidity() == null) {
            return ApiResponse.error("No OTP requested. Please request a new OTP.");
        }
        if (LocalDateTime.now().isAfter(user.getOtpValidity())) {
            return ApiResponse.error("OTP has expired. Please request a new OTP.");
        }
        if (!user.getCOtp().equals(inputOtp)) {
            short attempts = (short) (user.getNoOfFailedAttempts() == null ? 1
                    : user.getNoOfFailedAttempts() + 1);
            user.setNoOfFailedAttempts(attempts);
            if (attempts >= MAX_OTP_ATTEMPTS) {
                user.setAccountNonLocked(false);
                userRepository.save(user);
                return ApiResponse.error("Too many failed attempts. Account locked. Contact support.");
            }
            userRepository.save(user);
            return ApiResponse.error("Invalid OTP. " + (MAX_OTP_ATTEMPTS - attempts) + " attempt(s) remaining.");
        }
        return null; // OTP valid
    }

    private String maskMobile(String mobile) {
        if (mobile == null || mobile.length() < 4) return mobile;
        return "XXXXXX" + mobile.substring(mobile.length() - 4);
    }
}
