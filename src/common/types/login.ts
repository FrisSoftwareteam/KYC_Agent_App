export type TLoginRequest = {
  email: string;
  password: string;
};

export type TChangePasswordRequest = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export type TSyncLocationRequest = {
  status: string;
  position: {
    longitude: number;
    latitude: number;
  };
};

export type LoginResponse = {
  code: number;
  data: {
    jwt: {
      accessToken: string;
      refreshToken: string;
    };
    user: {id: string; agentId: string; partnerId: string};
  };
  status: true;
};

export type TProfile = {
  data: {
    _id: string;
    status: string;
    onlineStatus: string;
    eventId: string;
    imageUrl: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: {
        countryCode: string;
        number: string;
      };
      userType: string;
      status: string;
      mustChangePassword: boolean;
      isEmailVerified: boolean;
    };
    partner: {
      _id: string;
      name: string;
      address: string;
      country: {
        code: string;
        name: string;
      };
    };
  };
  code: number;
  status: boolean;
};

export type rolesBody = {
  id: string;
};

export type PersmissionRoleResponse = {
  data: {
    role: {
      id: string;
      name: string;
    };
    permissions: Array<string>;
  };
  code: 200;
  status: true;
};
