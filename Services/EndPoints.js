class EndPoints {
    static Service = {
      requestData: "/Request/GetRequestEntityRecords",
      requestStepData: "/Request/GetRequestStepEntityRecords",
      requestSubmit: "/Request/SubmitRequestEntityRecords",
      requestStepDetails: "/Request/GetRequestStepDetails",
      UpdateRequestStepStatus: "/Request/UpdateRequestStepStatus",
      PendingRequestStepData: "/Request/GetPendingRequestStepEntityRecords",
    };
    static Token = {
      token: "/Token/token",
      refreshToken: "/Token/refresh",
    };
    static Profile = {
      profile: "/Profile/profile",
    };
  }
  
  export default EndPoints;
  