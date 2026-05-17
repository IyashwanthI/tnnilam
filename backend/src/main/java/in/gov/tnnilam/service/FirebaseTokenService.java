package in.gov.tnnilam.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Verifies Firebase ID tokens issued after phone OTP verification.
 */
@Slf4j
@Service
public class FirebaseTokenService {

    /**
     * Verifies the Firebase ID token and returns the phone number.
     *
     * @param idToken Firebase ID token from the frontend
     * @return verified phone number in E.164 format (e.g. +919876543210)
     * @throws IllegalArgumentException if token is invalid or Firebase is not configured
     */
    public String verifyTokenAndGetPhone(String idToken) {
        if (FirebaseApp.getApps().isEmpty()) {
            throw new IllegalStateException(
                "Firebase Admin SDK not initialized. Configure service account credentials.");
        }

        try {
            FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String phoneNumber = decoded.getClaims().get("phone_number") != null
                    ? decoded.getClaims().get("phone_number").toString()
                    : null;

            if (phoneNumber == null || phoneNumber.isBlank()) {
                throw new IllegalArgumentException("Firebase token does not contain a phone number claim.");
            }

            log.debug("Firebase token verified for phone: {}", phoneNumber);
            return phoneNumber; // e.g. "+919876543210"

        } catch (com.google.firebase.auth.FirebaseAuthException e) {
            log.warn("Firebase token verification failed: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid or expired Firebase token: " + e.getMessage());
        }
    }

    /**
     * Extracts the 10-digit mobile number from E.164 format.
     * "+919876543210" → "9876543210"
     */
    public String extractMobile(String e164Phone) {
        if (e164Phone == null) return null;
        // Remove +91 prefix for Indian numbers
        if (e164Phone.startsWith("+91") && e164Phone.length() == 13) {
            return e164Phone.substring(3);
        }
        // Fallback: strip leading +
        return e164Phone.replaceAll("^\\+\\d{1,3}", "");
    }
}
