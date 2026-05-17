package in.gov.tnnilam.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "citizen_user_profile")
public class CitizenUserProfile {

    @Id
    @Column(name = "mobile", length = 10, nullable = false)
    private String mobile;

    @Column(name = "email", length = 40)
    private String email;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "mother_name", length = 50)
    private String motherName;

    @Column(name = "father_name", length = 50)
    private String fatherName;

    @Column(name = "temporary_address", length = 200)
    private String temporaryAddress;

    @Column(name = "permanent_address", length = 200)
    private String permanentAddress;

    @Column(name = "gender", length = 1)
    private String gender;

    @Column(name = "createdon")
    private LocalDateTime createdOn;

    @Column(name = "updatedon")
    private LocalDateTime updatedOn;

    @Column(name = "updatedby", length = 20)
    private String updatedBy;

    @Column(name = "ip_address", length = 20)
    private String ipAddress;

    @Column(name = "is_developer")
    private Boolean isDeveloper = false;

    @Column(name = "is_power_agent")
    private Boolean isPowerAgent = false;

    @Column(name = "name_in_tamil", length = 300)
    private String nameInTamil;
}
