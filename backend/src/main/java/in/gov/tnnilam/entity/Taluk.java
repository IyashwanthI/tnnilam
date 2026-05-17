package in.gov.tnnilam.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "taluk")
@IdClass(TalukId.class)
public class Taluk {

    @Id
    @Column(name = "district_code", length = 2)
    private String districtCode;

    @Id
    @Column(name = "taluk_code", length = 2)
    private String talukCode;

    @Column(name = "taluk_tname", length = 30)
    private String talukTname;

    @Column(name = "taluk_name", length = 30)
    private String talukName;

    @Column(name = "lgd_taluk_code", length = 4)
    private String lgdTalukCode;

    @Column(name = "rem_flag", length = 2)
    private String remFlag;
}
