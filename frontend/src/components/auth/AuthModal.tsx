"use client";

import { useMemo, useState } from "react";
import { XIcon } from "lucide-react";

import { t } from "@/common/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import type { AuthMode } from "@/types/auth";
import { cn } from "cn";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthFieldProps = {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  className?: string;
};

const AuthField = ({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  invalid,
  className,
}: AuthFieldProps) => (
  <label
    htmlFor={id}
    className={cn(
      "relative block px-4 py-3 has-[:focus-visible]:shadow-[inset_0_0_0_2px_var(--color-ink)]",
      className,
    )}
  >
    <span className="block text-xs font-medium text-ink-muted">{label}</span>
    <input
      id={id}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={event => onChange(event.target.value)}
      aria-invalid={invalid}
      className="mt-0.5 w-full border-0 bg-transparent p-0 text-base text-ink outline-none placeholder:text-ink-muted/70"
    />
  </label>
);

const SocialButton = ({ label }: { label: string }) => (
  <button
    type="button"
    className="flex h-12 w-full items-center justify-center rounded-lg border border-ink/20 bg-white text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
  >
    {label}
  </button>
);

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

  const headerTitle = useMemo(
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
      <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-[568px]">
        <DialogHeader className="relative border-b border-hairline px-6 py-4">
          <DialogClose
            render={
              <button
                type="button"
                className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted"
              />
            }
          >
            <XIcon className="size-4" />
            <span className="sr-only">{t("common.close")}</span>
          </DialogClose>
          <DialogTitle className="text-center text-base font-semibold">{headerTitle}</DialogTitle>
          <DialogDescription className="sr-only">{headerTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-6">
          <div>
            <h2 className="text-[22px] font-semibold leading-7 text-ink">
              {t("auth.modal.welcomeTitle")}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <SocialButton label={t("auth.modal.continueWithGoogle")} />
            <SocialButton label={t("auth.modal.continueWithApple")} />
          </div>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
            <span className="text-xs text-ink-muted">{t("auth.modal.or")}</span>
            <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
          </div>

          <div className="overflow-hidden rounded-lg border border-ink/20">
            {authMode === "register" ? (
              <AuthField
                id="auth-name"
                label={t("auth.namePlaceholder")}
                autoComplete="name"
                value={name}
                onChange={setName}
                invalid={Boolean(errors.name)}
                className="border-b border-ink/20"
              />
            ) : null}
            <AuthField
              id="auth-email"
              label={t("auth.email")}
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              invalid={Boolean(errors.email)}
              className="border-b border-ink/20"
            />
            <AuthField
              id="auth-password"
              label={t("auth.password")}
              type="password"
              autoComplete={authMode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={setPassword}
              invalid={Boolean(errors.password)}
              className={authMode === "register" ? "border-b border-ink/20" : undefined}
            />
            {authMode === "register" ? (
              <AuthField
                id="auth-password-confirmation"
                label={t("auth.passwordConfirmationPlaceholder")}
                type="password"
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={setPasswordConfirmation}
                invalid={Boolean(errors.passwordConfirmation)}
              />
            ) : null}
          </div>

          {(errors.name ?? errors.email ?? errors.password ?? errors.passwordConfirmation) ? (
            <div className="space-y-1 text-xs text-destructive">
              {errors.name ? <p>{errors.name}</p> : null}
              {errors.email ? <p>{errors.email}</p> : null}
              {errors.password ? <p>{errors.password}</p> : null}
              {errors.passwordConfirmation ? <p>{errors.passwordConfirmation}</p> : null}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-lg bg-brand text-base font-semibold text-on-brand hover:bg-brand-dark"
          >
            {authMode === "login" ? t("auth.signIn") : t("auth.continue")}
          </Button>

          <div className="text-center text-sm text-ink">
            {authMode === "login" ? (
              <button
                type="button"
                className="font-semibold underline underline-offset-2"
                onClick={() => switchMode("register")}
              >
                {t("auth.modal.switchToRegister")}
              </button>
            ) : (
              <button
                type="button"
                className="font-semibold underline underline-offset-2"
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
