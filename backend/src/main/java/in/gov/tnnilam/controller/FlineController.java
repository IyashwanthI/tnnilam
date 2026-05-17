package in.gov.tnnilam.controller;

import in.gov.tnnilam.dto.ApiResponse;
import in.gov.tnnilam.entity.District;
import in.gov.tnnilam.entity.Taluk;
import in.gov.tnnilam.entity.Village;
import in.gov.tnnilam.repository.DistrictRepository;
import in.gov.tnnilam.repository.TalukRepository;
import in.gov.tnnilam.repository.VillageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Date;
import java.sql.Timestamp;
import in.gov.tnnilam.repository.ApplLogRepository;
import in.gov.tnnilam.entity.ApplLog;
import in.gov.tnnilam.dto.FLineRequest;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
@RestController
@RequestMapping("/fline")
@RequiredArgsConstructor
public class FlineController {

    private final ApplLogRepository applLogRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> apply(
            @RequestBody FLineRequest req) {

        ApplLog appl = new ApplLog();

        String applId =
                "FLN" + System.currentTimeMillis();

        appl.setApplId(applId);

        appl.setUserId("citizen");

        appl.setServiceCode("FLN1");

        appl.setDistrictCode(req.getDistrictCode());

        appl.setTalukCode(req.getTalukCode());

        appl.setVillageCode(req.getVillageCode());

        appl.setSurveyNo(req.getSurveyNo());

        appl.setSubdivNo(req.getSubdivisionNo());

        appl.setPattaNo(req.getPattaNo());

        appl.setGovtCharge(req.getGovtCharge());

        appl.setApplDt(LocalDate.now());

        appl.setUpdateDt(LocalDateTime.now());

        appl.setGeneratedDate(LocalDateTime.now());

        appl.setApplStatus("AP");

        applLogRepository.save(appl);

        return ResponseEntity.ok(
            ApiResponse.ok(
                "Application submitted",
                Map.of("applId", applId)
            )
        );
    }
}
