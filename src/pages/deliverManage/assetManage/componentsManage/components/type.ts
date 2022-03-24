export type BaseDetailRes = {
  code: number;
  msg: string;
  id: number;
  name: string;
  version: string;
  remark: string;
  belongSystemVersionString: string;
  belongCarModelString: string;
  belongCarModel: {
    carModelId: number;
    carModelName: string;
    carModelVersion: string;
  };
  loophole: {
    highRisk: number;
    warning: number;
    lowRisk: number;
  };
  createUser: string;
  createTime: string;
};

interface retrieveData {
  retrieveColumn: string;
  retrieveLike: boolean;
  retrieveValue: string[];
}
interface sortData {
  descending: true;
  sortBy: string;
}
export type HardwareDetailReq = {
  autoPartsId: number;
  retrieve: {
    offset: {
      currentPage: number;
      pageSize: number;
    };
    retrieveData?: retrieveData[];
    sortData?: sortData[];
  };
};

export type RelieveRelationHardwareReq = {
  autoPartId: number;
  hardwareId: number;
};

export type RelationHardwareReq = {
  belongAutoPartIds: number[];
  idList: number[];
};

export type SystemListGroupReq = {
  autoPartsId: number;
  autoPartsType: "ecu"|"cloud"| "mobile"; 
};
