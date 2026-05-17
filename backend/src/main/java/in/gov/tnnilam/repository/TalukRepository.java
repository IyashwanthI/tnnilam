package in.gov.tnnilam.repository;

import in.gov.tnnilam.entity.Taluk;
import in.gov.tnnilam.entity.TalukId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TalukRepository extends JpaRepository<Taluk, TalukId> {

    @Query("SELECT t FROM Taluk t WHERE t.districtCode = :districtCode AND (t.remFlag IS NULL OR t.remFlag != 'D') ORDER BY t.talukName")
    List<Taluk> findByDistrictCode(@Param("districtCode") String districtCode);
}
