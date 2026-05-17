package in.gov.tnnilam.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class VillageId implements Serializable {
    private String districtCode;
    private String talukCode;
    private String villageCode;
}
