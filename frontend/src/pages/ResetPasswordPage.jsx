import { AuthLayout } from "@widgets/layouts";
import { ResetPasswordForm } from "@features/auth/reset-password/ui/ResetPasswordForm.jsx";
import { AUTH_SCREENS } from "@shared/constants/auth.constants.js";

export function ResetPasswordPage({ onNavigate, verifiedToken }) {
  return (
    <AuthLayout
      title="Новый пароль"
      subtitle="Код подтверждён. Придумайте новый пароль."
    >
      <ResetPasswordForm
        verifiedToken={verifiedToken}
        onSuccess={() =>
          onNavigate(AUTH_SCREENS.LOGIN, {
            notice: "Пароль изменён. Войдите с новым паролем.",
          })
        }
        onBack={() => onNavigate(AUTH_SCREENS.LOGIN)}
      />
    </AuthLayout>
  );
}
