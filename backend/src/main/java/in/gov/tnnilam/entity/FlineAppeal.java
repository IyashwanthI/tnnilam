package in.gov.tnnilam.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Stores F-Line (Field Line) appeal applications submitted by citizens.
 * Links to misc_transfers for the underlying land mutation record.
 */
@Data
@Entity
@Table(name = "fline_appeal")
public class FlineAppeal {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "fline_appeal_seq")
    @SequenceGenerator(name = "fline_appeal_seq", sequenceName = "fline_appeal_slno_seq", allocationSize = 1)
    @Column(name = "slno")
    private Long slno;

    /** Citizen's mobile (FK to citizen_users) */
    @Column(name = "mobile", length = 10, nullable = false)
    private String mobile;

    /** Applicant name */
    @Column(name = "applicant_name", length = 100, nullable = false)
    private String applicantName;

    /** Land location */
    @Column(name = "district_code", length = 2, nullable = false)
    private String districtCode;

    @Column(name = "taluk_code", length = 2, nullable = false)
    private String talukCode;

    @Column(name = "village_code", length = 3, nullable = false)
    private String villageCode;

    @Column(name = "survey_no", length = 6, nullable = false)
    private String surveyNo;

    @Column(name = "subdiv_no", length = 10)
    private String subdivNo;

    @Column(name = "patta_no", length = 20)
    private String pattaNo;

    /** Reference to misc_transfers appl_id if applicable */
    @Column(name = "ref_appl_id", length = 25)
    private String refApplId;

    /** Nature of appeal */
    @Column(name = "appeal_reason", length = 500, nullable = false)
    private String appealReason;

    /** Supporting document path/reference */
    @Column(name = "document_ref", length = 255)
    private String documentRef;

    /**
     * Status: SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
     */
    @Column(name = "status", length = 20, nullable = false)
    private String status = "SUBMITTED";

    @Column(name = "remarks", length = 500)
    private String remarks;

    @Column(name = "submit_dt", nullable = false)
    private LocalDateTime submitDt;

    @Column(name = "update_dt")
    private LocalDateTime updateDt;

    @Column(name = "appl_id", length = 30, unique = true)
    private String applId;

    /** Extent of land in hectares */
    @Column(name = "extent_hect", precision = 10, scale = 2)
    private java.math.BigDecimal extentHect;

    /** Extent in ares */
    @Column(name = "extent_ares", precision = 10, scale = 2)
    private java.math.BigDecimal extentAres;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;
}
