package in.gov.tnnilam.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class FlineAppealRequest {

    @NotBlank(message = "Applicant name is required")
    @Size(max = 100)
    private String applicantName;

    @NotBlank(message = "District is required")
    private String districtCode;

    @NotBlank(message = "Taluk is required")
    private String talukCode;

    @NotBlank(message = "Village is required")
    private String villageCode;

    @NotBlank(message = "Survey number is required")
    @Size(max = 6)
    private String surveyNo;

    @Size(max = 10)
    private String subdivNo;

    @Size(max = 20)
    private String pattaNo;

    /** Reference application ID from misc_transfers if available */
    @Size(max = 25)
    private String refApplId;

    @NotBlank(message = "Appeal reason is required")
    @Size(min = 20, max = 500, message = "Appeal reason must be between 20 and 500 characters")
    private String appealReason;

    @DecimalMin(value = "0.0", inclusive = false, message = "Extent must be positive")
    private BigDecimal extentHect;

    private BigDecimal extentAres;
}
