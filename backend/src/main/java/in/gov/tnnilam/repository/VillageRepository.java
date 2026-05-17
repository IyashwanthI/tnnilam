package in.gov.tnnilam.repository;

import in.gov.tnnilam.entity.Village;
import in.gov.tnnilam.entity.VillageId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VillageRepository extends JpaRepository<Village, VillageId> {

    @Query("SELECT v FROM Village v WHERE v.districtCode = :districtCode AND v.talukCode = :talukCode ORDER BY v.villageName")
    List<Village> findByDistrictAndTaluk(
            @Param("districtCode") String districtCode,
            @Param("talukCode") String talukCode);
}
