package in.gov.tnnilam.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FlineAppealResponse {
    private Long slno;
    private String applId;
    private String applicantName;
    private String mobile;
    private String districtCode;
    private String districtName;
    private String talukCode;
    private String talukName;
    private String villageCode;
    private String villageName;
    private String surveyNo;
    private String subdivNo;
    private String pattaNo;
    private String refApplId;
    private String appealReason;
    private String status;
    private String remarks;
    private LocalDateTime submitDt;
    private LocalDateTime updateDt;
    private BigDecimal extentHect;
    private BigDecimal extentAres;
}
