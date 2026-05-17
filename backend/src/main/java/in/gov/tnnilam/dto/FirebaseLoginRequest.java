package in.gov.tnnilam.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FirebaseLoginRequest {

    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String mobile;

    @NotBlank(message = "Firebase ID token is required")
    private String firebaseIdToken;
}
