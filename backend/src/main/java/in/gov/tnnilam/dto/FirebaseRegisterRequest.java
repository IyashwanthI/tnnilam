package in.gov.tnnilam.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FirebaseRegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String mobile;

    @NotBlank(message = "Firebase ID token is required")
    private String firebaseIdToken;
}
