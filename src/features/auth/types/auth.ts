export type AuthMode = "login" | "register";

export type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};