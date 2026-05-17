package in.gov.tnnilam.repository;

import in.gov.tnnilam.entity.FlineAppeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlineAppealRepository extends JpaRepository<FlineAppeal, Long> {

    List<FlineAppeal> findByMobileOrderBySubmitDtDesc(String mobile);

    Optional<FlineAppeal> findByApplId(String applId);
}
