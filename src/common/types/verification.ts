type TAddressData = {
  position: {
    latitude: string | number;
    longitude: string | number;
  };
  category: string;
  candidate: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imageUrl: string;
    dateOfBirth: string;
    createdAt: string;
  };
  formatAddress: string;
  details: {};
  status: string;
  notes: [];
  images: [];
  createdAt: string;
  _id: string;
  googleMapUrl: string;
};

export type TTaskRequest = {
  address: string;
  task: string;
  status: 'accept' | 'decline';
};

export type TTaskResponse = {
  code: number;
  data: string;
  status: boolean;
};

export type TVerification = {
  data: {
    meta: {
      lastPage: number;
      total: number;
      from: number;
      to: number;
      perPage: number;
      currentPage: number;
      prevPage: null | number;
      nextPage: null | number;
    };
    addresses: Array<TAddressData>;
  };
  code: 200;
  status: true;
};

export type TAddress = {
  data: TAddressData;
  code: 200;
  status: true;
};

export type TAddressStatus = {
  address: string;
  status: 'inprogress';
};

export type TSubmitAddress = {
  address: string;
  status: string;
  position: {
    latitude: number;
    longitude: number;
  };
};

export type TAddressInfo = {
  address: string;
  notes: Array<string>;
  images: Array<string>;
  signature: string;
  buildingType: string;
  buildingColor: string;
  gatePresent: boolean;
  gateColor: string;
  closestLandmark: string;
};

export type TUpload = {
  code: number;
  data: {
    url: string;
  };
  status: boolean;
};
