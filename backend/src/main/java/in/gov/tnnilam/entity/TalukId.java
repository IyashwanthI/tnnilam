package in.gov.tnnilam.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class TalukId implements Serializable {
    private String districtCode;
    private String talukCode;
}
