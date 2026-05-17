package in.gov.tnnilam.repository;

import in.gov.tnnilam.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, String> {

    @Query("SELECT d FROM District d WHERE d.remFlag IS NULL OR d.remFlag != 'D' ORDER BY d.districtName")
    List<District> findAllActive();
}
