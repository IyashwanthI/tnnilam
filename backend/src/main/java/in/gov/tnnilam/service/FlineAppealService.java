package in.gov.tnnilam.service;

import in.gov.tnnilam.dto.ApiResponse;
import in.gov.tnnilam.dto.FlineAppealRequest;
import in.gov.tnnilam.dto.FlineAppealResponse;
import in.gov.tnnilam.entity.*;
import in.gov.tnnilam.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlineAppealService {

    private final FlineAppealRepository appealRepository;
    private final DistrictRepository districtRepository;
    private final TalukRepository talukRepository;
    private final VillageRepository villageRepository;
    private final CitizenUserRepository userRepository;

    /**
     * Submit a new F-Line appeal.
     */
    @Transactional
    public ApiResponse<FlineAppealResponse> submitAppeal(String mobile, FlineAppealRequest request,
                                                          String ipAddress) {
        CitizenUser user = userRepository.findByMobile(mobile)
                .orElse(null);
        if (user == null || !user.getEnabled()) {
            return ApiResponse.error("User not found or not verified.");
        }

        FlineAppeal appeal = new FlineAppeal();
        appeal.setMobile(mobile);
        appeal.setApplicantName(request.getApplicantName());
        appeal.setDistrictCode(request.getDistrictCode());
        appeal.setTalukCode(request.getTalukCode());
        appeal.setVillageCode(request.getVillageCode());
        appeal.setSurveyNo(request.getSurveyNo());
        appeal.setSubdivNo(request.getSubdivNo());
        appeal.setPattaNo(request.getPattaNo());
        appeal.setRefApplId(request.getRefApplId());
        appeal.setAppealReason(request.getAppealReason());
        appeal.setExtentHect(request.getExtentHect());
        appeal.setExtentAres(request.getExtentAres());
        appeal.setStatus("SUBMITTED");
        appeal.setSubmitDt(LocalDateTime.now());
        appeal.setIpAddress(ipAddress);
        appeal.setApplId(generateApplId(request.getDistrictCode(), request.getTalukCode()));

        FlineAppeal saved = appealRepository.save(appeal);
        return ApiResponse.ok("Appeal submitted successfully", toResponse(saved));
    }

    /**
     * Get all appeals for the logged-in citizen.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<FlineAppealResponse>> getMyAppeals(String mobile) {
        List<FlineAppeal> appeals = appealRepository.findByMobileOrderBySubmitDtDesc(mobile);
        List<FlineAppealResponse> responses = appeals.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.ok("Appeals fetched", responses);
    }

    /**
     * Get a single appeal by application ID.
     */
    @Transactional(readOnly = true)
    public ApiResponse<FlineAppealResponse> getAppealByApplId(String mobile, String applId) {
        Optional<FlineAppeal> opt = appealRepository.findByApplId(applId);
        if (opt.isEmpty()) {
            return ApiResponse.error("Application not found.");
        }
        FlineAppeal appeal = opt.get();
        if (!appeal.getMobile().equals(mobile)) {
            return ApiResponse.error("Access denied.");
        }
        return ApiResponse.ok("Appeal fetched", toResponse(appeal));
    }

    // ---- helpers ----

    private FlineAppealResponse toResponse(FlineAppeal appeal) {
        FlineAppealResponse r = new FlineAppealResponse();
        r.setSlno(appeal.getSlno());
        r.setApplId(appeal.getApplId());
        r.setApplicantName(appeal.getApplicantName());
        r.setMobile(appeal.getMobile());
        r.setDistrictCode(appeal.getDistrictCode());
        r.setTalukCode(appeal.getTalukCode());
        r.setVillageCode(appeal.getVillageCode());
        r.setSurveyNo(appeal.getSurveyNo());
        r.setSubdivNo(appeal.getSubdivNo());
        r.setPattaNo(appeal.getPattaNo());
        r.setRefApplId(appeal.getRefApplId());
        r.setAppealReason(appeal.getAppealReason());
        r.setStatus(appeal.getStatus());
        r.setRemarks(appeal.getRemarks());
        r.setSubmitDt(appeal.getSubmitDt());
        r.setUpdateDt(appeal.getUpdateDt());
        r.setExtentHect(appeal.getExtentHect());
        r.setExtentAres(appeal.getExtentAres());

        // Enrich with names
        districtRepository.findById(appeal.getDistrictCode())
                .ifPresent(d -> r.setDistrictName(d.getDistrictName()));

        TalukId talukId = new TalukId();
        talukId.setDistrictCode(appeal.getDistrictCode());
        talukId.setTalukCode(appeal.getTalukCode());
        talukRepository.findById(talukId)
                .ifPresent(t -> r.setTalukName(t.getTalukName()));

        VillageId villageId = new VillageId();
        villageId.setDistrictCode(appeal.getDistrictCode());
        villageId.setTalukCode(appeal.getTalukCode());
        villageId.setVillageCode(appeal.getVillageCode());
        villageRepository.findById(villageId)
                .ifPresent(v -> r.setVillageName(v.getVillageName()));

        return r;
    }

    private String generateApplId(String districtCode, String talukCode) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        return "FLA" + districtCode + talukCode + timestamp;
    }
}
