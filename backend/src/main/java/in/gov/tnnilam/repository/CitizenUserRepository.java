package in.gov.tnnilam.repository;

import in.gov.tnnilam.entity.CitizenUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CitizenUserRepository extends JpaRepository<CitizenUser, Integer> {

    Optional<CitizenUser> findByMobile(String mobile);

    boolean existsByMobile(String mobile);

    boolean existsByEmail(String email);
}
