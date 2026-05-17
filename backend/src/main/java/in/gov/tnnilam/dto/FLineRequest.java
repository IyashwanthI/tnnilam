package in.gov.tnnilam.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FLineRequest {

    private String districtCode;

    private String talukCode;

    private String villageCode;

    private String surveyNo;

    private String subdivisionNo;

    private Long pattaNo;

    private String boundaryType;

    private String drawingType;

    private Integer noOfBoundaries;

    private String reason;

    private Integer govtCharge;
}
