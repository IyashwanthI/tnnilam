package in.gov.tnnilam.repository;

import in.gov.tnnilam.entity.CitizenUserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CitizenUserProfileRepository extends JpaRepository<CitizenUserProfile, String> {

    Optional<CitizenUserProfile> findByMobile(String mobile);
}
