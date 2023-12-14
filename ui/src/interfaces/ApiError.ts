export interface ApiError {
  status: number;
  data: {
    errorCode: string;
    message: string;
  };
}
