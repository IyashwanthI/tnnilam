export interface District {
  districtCode: string;
  districtName: string;
  districtTname: string;
}

export interface Taluk {
  districtCode: string;
  talukCode: string;
  talukName: string;
  talukTname: string;
}

export interface Village {
  districtCode: string;
  talukCode: string;
  villageCode: string;
  villageName: string;
  villageTname: string;
}
