package in.gov.tnnilam.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "citizen_users")
public class CitizenUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "mobile", length = 10, nullable = false)
    private String mobile;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "enabled")
    private Boolean enabled = false;

    @Column(name = "account_non_expired")
    private Boolean accountNonExpired = true;

    @Column(name = "credentials_non_expired")
    private Boolean credentialsNonExpired = true;

    @Column(name = "account_non_locked")
    private Boolean accountNonLocked = true;

    @Column(name = "c_otp", length = 10)
    private String cOtp;

    @Column(name = "otp_validity")
    private LocalDateTime otpValidity;

    @Column(name = "otp_sent_count")
    private Short otpSentCount = 0;

    @Column(name = "otp_sent_time")
    private LocalDateTime otpSentTime;

    @Column(name = "no_of_failed_attempts")
    private Short noOfFailedAttempts = 0;

    @Column(name = "createdon")
    private LocalDateTime createdOn;

    @Column(name = "updatedon")
    private LocalDateTime updatedOn;

    @Column(name = "createdby", length = 50)
    private String createdBy;

    @Column(name = "updatedby", length = 50)
    private String updatedBy;

    @Column(name = "ip_address", length = 20)
    private String ipAddress;

    @Column(name = "refresh_token", length = 100)
    private String refreshToken;
}
