package in.gov.tnnilam.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "village")
@IdClass(VillageId.class)
public class Village {

    @Id
    @Column(name = "district_code", length = 2)
    private String districtCode;

    @Id
    @Column(name = "taluk_code", length = 2)
    private String talukCode;

    @Id
    @Column(name = "village_code", length = 3)
    private String villageCode;

    @Column(name = "village_tname", length = 150)
    private String villageTname;

    @Column(name = "village_name", length = 30)
    private String villageName;

    @Column(name = "lgd_village_code", length = 6)
    private String lgdVillageCode;
}
