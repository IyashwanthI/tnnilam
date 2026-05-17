package in.gov.tnnilam.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import in.gov.tnnilam.entity.ApplLog;

@Repository
public interface ApplLogRepository
        extends JpaRepository<ApplLog, Integer> {
}
