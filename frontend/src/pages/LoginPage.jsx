import { AuthLayout } from "@widgets/layouts";
import { LoginForm } from "@features/auth/login/ui/LoginForm.jsx";
import { AUTH_SCREENS } from "@shared/constants/auth.constants.js";

export function LoginPage({ onNavigate, onLoginSuccess, notice }) {
  return (
    <AuthLayout title="Вход" subtitle="Врата королевства открыты для вас.">
      <LoginForm
        notice={notice}
        onSuccess={(email) => {
          if (onLoginSuccess) {
            onLoginSuccess(email);
          } else {
            onNavigate(AUTH_SCREENS.APP);
          }
        }}
        onRegister={() => onNavigate(AUTH_SCREENS.REGISTER)}
        onForgot={() => onNavigate(AUTH_SCREENS.FORGOT)}
      />
    </AuthLayout>
  );
}
