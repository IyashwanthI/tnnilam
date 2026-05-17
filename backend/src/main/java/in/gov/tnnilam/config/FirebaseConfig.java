package in.gov.tnnilam.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account-path:}")
    private String serviceAccountPath;

    @PostConstruct
    public void initialize() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return; // Already initialized
        }

        try {
            GoogleCredentials credentials;

            if (serviceAccountPath != null && !serviceAccountPath.isBlank()) {
                // Load from file path (production)
                try (InputStream is = new FileInputStream(serviceAccountPath)) {
                    credentials = GoogleCredentials.fromStream(is);
                }
                log.info("Firebase initialized from service account file: {}", serviceAccountPath);
            } else {
                // Use Application Default Credentials (dev/CI)
                credentials = GoogleCredentials.getApplicationDefault();
                log.info("Firebase initialized with Application Default Credentials");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId("yash1290")
                    .build();

            FirebaseApp.initializeApp(options);
            log.info("Firebase Admin SDK initialized successfully for project: yash1290");

        } catch (IOException e) {
            log.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage());
            log.warn("Firebase token verification will be unavailable. " +
                     "Set firebase.service-account-path in application.yml or configure ADC.");
        }
    }
}
