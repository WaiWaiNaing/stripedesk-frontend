export type AuthIntent = "registration" | "reset_password";
export type UserRole = "admin" | "user";

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    intent?: string | null;
  };
}

export interface ResendOtpRequest {
  email: string;
  intent: AuthIntent;
}

export interface ResendOtpPayload {
  status: string;
  requires_verification: boolean;
  intent: AuthIntent;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  intent: AuthIntent;
}

export interface ResetPasswordRequest {
  email: string;
  reset_token: string;
  new_password: string;
}

export interface LoginPayload {
  requires_verification: boolean;
}

export interface TokenPayload {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterPayload {
  id: number;
  email: string;
  requires_verification?: boolean;
}

export interface ForgotPayload {
  status: string;
}

export interface VerifyOtpResetPayload {
  reset_token: string;
  intent: AuthIntent;
}

export interface ResetPasswordPayload extends TokenPayload {
  status?: string;
}

export interface RefreshPayload {
  status: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type LoginResponse = ApiSuccessResponse<LoginPayload>;
export type RegisterResponse = ApiSuccessResponse<RegisterPayload>;
export type ForgotResponse = ApiSuccessResponse<ForgotPayload>;
export type VerifyOtpTokenResponse = ApiSuccessResponse<TokenPayload>;
export type VerifyOtpResetResponse = ApiSuccessResponse<VerifyOtpResetPayload>;
export type VerifyOtpResponse = VerifyOtpTokenResponse | VerifyOtpResetResponse;
export type ResetPasswordResponse = ApiSuccessResponse<ResetPasswordPayload>;
export type UserProfileResponse = ApiSuccessResponse<UserProfile>;
export type ResendOtpResponse = ApiSuccessResponse<ResendOtpPayload>;
export type RefreshResponse = ApiSuccessResponse<RefreshPayload>;
