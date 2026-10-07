export type TMetrics = {
  code: number;
  data: {
    _id: null;
    totalCompleted: number;
    totalFailed: number;
    totalInprogress: number;
  };
  status: boolean;
};

export type TTrending = {
  code: number;
  data: Array<{
    _id: string;
    candidate: {
      _id: string;
      firstName: string;
      imageUrl: string;
      lastName: string;
      phoneNumber: string;
    };
    formatAddress: string;
    category: string;
    createdAt: string;
    images: [];
    notes: [];
    position: {latitude: string; longitude: string};
    status: string;
  }>;
  status: boolean;
};
