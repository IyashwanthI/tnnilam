package in.gov.tnnilam.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "appl_log")
@Getter
@Setter
public class ApplLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slno")
    private Integer slno;

    @Column(name = "appl_id", unique = true)
    private String applId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "service_code")
    private String serviceCode;

    @Column(name = "district_code")
    private String districtCode;

    @Column(name = "taluk_code")
    private String talukCode;

    @Column(name = "village_code")
    private String villageCode;

    @Column(name = "survey_no")
    private String surveyNo;

    @Column(name = "subdiv_no")
    private String subdivNo;

    @Column(name = "patta_no")
    private Long pattaNo;

    @Column(name = "govt_charge")
    private Integer govtCharge;

    @Column(name = "appl_status")
    private String applStatus;

    @Column(name = "appl_dt")
    private LocalDate applDt;

    @Column(name = "update_dt")
    private LocalDateTime updateDt;

    @Column(name = "generated_date")
    private LocalDateTime generatedDate;
}