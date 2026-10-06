"use client";

import { useMemo, useState } from "react";

import { t } from "@/common/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { AuthMode } from "@/types/auth";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthModal = () => {
  const {
    authModalOpen,
    authMode,
    closeAuthModal,
    setAuthMode,
    login,
    register,
    isSubmitting,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setErrors({});
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      closeAuthModal();
    }
  };

  const title = useMemo(
    () =>
      authMode === "login"
        ? t("auth.modal.loginTitle")
        : t("auth.modal.registerTitle"),
    [authMode],
  );

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (authMode === "register" && !name.trim()) {
      nextErrors.name = t("auth.validation.nameRequired");
    }

    if (!email.trim()) {
      nextErrors.email = t("auth.validation.emailRequired");
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = t("auth.validation.emailInvalid");
    }

    if (!password) {
      nextErrors.password = t("auth.validation.passwordRequired");
    } else if (authMode === "register" && password.length < 8) {
      nextErrors.password = t("auth.validation.passwordMin");
    }

    if (authMode === "register") {
      if (!passwordConfirmation) {
        nextErrors.passwordConfirmation = t(
          "auth.validation.passwordConfirmationRequired",
        );
      } else if (passwordConfirmation !== password) {
        nextErrors.passwordConfirmation = t("auth.validation.passwordsMustMatch");
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    if (authMode === "login") {
      await login({ email: email.trim(), password });
    } else {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    }
    resetForm();
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrors({});
  };

  return (
    <Dialog open={authModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[568px]">
        <DialogHeader className="border-b px-6 py-4 text-center">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          {authMode === "register" ? (
            <div className="space-y-1">
              <Input
                autoComplete="name"
                placeholder={t("auth.namePlaceholder")}
                value={name}
                onChange={event => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">{errors.name}</p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-1">
            <Input
              type="email"
              autoComplete="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={event => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              autoComplete={
                authMode === "login" ? "current-password" : "new-password"
              }
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={event => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password}</p>
            ) : null}
          </div>

          {authMode === "register" ? (
            <div className="space-y-1">
              <Input
                type="password"
                autoComplete="new-password"
                placeholder={t("auth.passwordConfirmationPlaceholder")}
                value={passwordConfirmation}
                onChange={event => setPasswordConfirmation(event.target.value)}
                aria-invalid={Boolean(errors.passwordConfirmation)}
              />
              {errors.passwordConfirmation ? (
                <p className="text-xs text-destructive">
                  {errors.passwordConfirmation}
                </p>
              ) : null}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-lg bg-[#ff385c] text-base font-semibold hover:bg-[#e31c5f]"
          >
            {authMode === "login" ? t("auth.signIn") : t("auth.continue")}
          </Button>

          <div className="border-t pt-4 text-center text-sm">
            {authMode === "login" ? (
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => switchMode("register")}
              >
                {t("auth.modal.switchToRegister")}
              </button>
            ) : (
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => switchMode("login")}
              >
                {t("auth.modal.switchToLogin")}
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
