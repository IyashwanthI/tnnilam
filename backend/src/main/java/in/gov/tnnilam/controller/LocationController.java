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

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
public class LocationController {

    private final DistrictRepository districtRepository;
    private final TalukRepository talukRepository;
    private final VillageRepository villageRepository;

    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<District>>> getDistricts() {
        return ResponseEntity.ok(ApiResponse.ok("Districts fetched", districtRepository.findAllActive()));
    }

    @GetMapping("/taluks/{districtCode}")
    public ResponseEntity<ApiResponse<List<Taluk>>> getTaluks(@PathVariable String districtCode) {
        return ResponseEntity.ok(ApiResponse.ok("Taluks fetched",
                talukRepository.findByDistrictCode(districtCode)));
    }

    @GetMapping("/villages/{districtCode}/{talukCode}")
    public ResponseEntity<ApiResponse<List<Village>>> getVillages(
            @PathVariable String districtCode,
            @PathVariable String talukCode) {
        return ResponseEntity.ok(ApiResponse.ok("Villages fetched",
                villageRepository.findByDistrictAndTaluk(districtCode, talukCode)));
    }
}
