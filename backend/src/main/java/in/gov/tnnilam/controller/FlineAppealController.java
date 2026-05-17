package in.gov.tnnilam.controller;

import in.gov.tnnilam.dto.ApiResponse;
import in.gov.tnnilam.dto.FlineAppealRequest;
import in.gov.tnnilam.dto.FlineAppealResponse;
import in.gov.tnnilam.service.FlineAppealService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appeals")
@RequiredArgsConstructor
public class FlineAppealController {

    private final FlineAppealService appealService;

    /** POST /appeals - submit a new F-Line appeal */
    @PostMapping
    public ResponseEntity<ApiResponse<FlineAppealResponse>> submitAppeal(
            @AuthenticationPrincipal String mobile,
            @Valid @RequestBody FlineAppealRequest request,
            HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        return ResponseEntity.ok(appealService.submitAppeal(mobile, request, ip));
    }

    /** GET /appeals - get all appeals for logged-in citizen */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FlineAppealResponse>>> getMyAppeals(
            @AuthenticationPrincipal String mobile) {
        return ResponseEntity.ok(appealService.getMyAppeals(mobile));
    }

    /** GET /appeals/{applId} - get a specific appeal */
    @GetMapping("/{applId}")
    public ResponseEntity<ApiResponse<FlineAppealResponse>> getAppeal(
            @AuthenticationPrincipal String mobile,
            @PathVariable String applId) {
        return ResponseEntity.ok(appealService.getAppealByApplId(mobile, applId));
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
