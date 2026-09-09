"use client";

import { LoginFormContainer } from "./LoginFormContainer";
import { RegisterFormContainer } from "./RegisterFormContainer";
import type { AuthMode } from "../types/auth";

type AuthContainerProps = {
  mode: AuthMode;
};

export function AuthContainer({ mode }: AuthContainerProps) {
  return mode === "login" ? <LoginFormContainer /> : <RegisterFormContainer />;
}