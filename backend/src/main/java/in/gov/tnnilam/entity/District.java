package in.gov.tnnilam.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "district")
public class District {

    @Id
    @Column(name = "district_code", length = 2)
    private String districtCode;

    @Column(name = "district_tname", length = 60)
    private String districtTname;

    @Column(name = "district_name", length = 30)
    private String districtName;

    @Column(name = "district_sname", length = 3)
    private String districtSname;

    @Column(name = "lgd_district_code", length = 3)
    private String lgdDistrictCode;

    @Column(name = "rem_flag", length = 2)
    private String remFlag;
}
