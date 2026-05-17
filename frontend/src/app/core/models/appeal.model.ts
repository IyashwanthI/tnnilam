export interface FlineAppealRequest {
  applicantName: string;
  districtCode: string;
  talukCode: string;
  villageCode: string;
  surveyNo: string;
  subdivNo?: string;
  pattaNo?: string;
  refApplId?: string;
  appealReason: string;
  extentHect?: number;
  extentAres?: number;
}

export interface FlineAppealResponse {
  slno: number;
  applId: string;
  applicantName: string;
  mobile: string;
  districtCode: string;
  districtName: string;
  talukCode: string;
  talukName: string;
  villageCode: string;
  villageName: string;
  surveyNo: string;
  subdivNo: string;
  pattaNo: string;
  refApplId: string;
  appealReason: string;
  status: string;
  remarks: string;
  submitDt: string;
  updateDt: string;
  extentHect: number;
  extentAres: number;
}
