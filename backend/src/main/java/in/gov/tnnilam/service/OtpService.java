package in.gov.tnnilam.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

/**
 * Generates and (optionally) sends OTPs via SMS.
 * In mock mode (app.otp.mock=true), the OTP is logged instead of sent.
 */
@Slf4j
@Service
public class OtpService {

    @Value("${app.otp.length:6}")
    private int otpLength;

    @Value("${app.otp.mock:true}")
    private boolean mockMode;

    private final SecureRandom random = new SecureRandom();

    /**
     * Generates a numeric OTP of configured length.
     */
    public String generateOtp() {
        int bound = (int) Math.pow(10, otpLength);
        int otp = random.nextInt(bound);
        return String.format("%0" + otpLength + "d", otp);
    }

    /**
     * Sends OTP to the given mobile number.
     * In mock mode, logs the OTP instead of calling an SMS gateway.
     *
     * @param mobile 10-digit mobile number
     * @param otp    generated OTP
     */
    public void sendOtp(String mobile, String otp) {
        if (mockMode) {
            // DEV MODE: print OTP to log — replace with real SMS gateway in production
            log.info("========================================");
            log.info("  [MOCK SMS] Mobile: {} | OTP: {}", mobile, otp);
            log.info("========================================");
        } else {
            // TODO: Integrate with Tamil Nadu e-Sevai / BSNL SMS gateway
            // Example: smsGatewayClient.send(mobile, "Your Tamil Nilam OTP is: " + otp);
            log.warn("SMS gateway not configured. OTP for {} not sent.", mobile);
        }
    }
}
