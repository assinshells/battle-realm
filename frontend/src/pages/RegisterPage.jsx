import { AuthLayout } from "@widgets/layouts";
import { RegisterForm } from "@features/auth/register/ui/RegisterForm.jsx";
import { AUTH_SCREENS } from "@shared/constants/auth.constants.js";

export function RegisterPage({ onNavigate }) {
  return (
    <AuthLayout
      title="Регистрация"
      subtitle="Присоединяйтесь к войску Battle Realm."
    >
      <RegisterForm
        onSuccess={() =>
          onNavigate(AUTH_SCREENS.LOGIN, {
            notice: "Аккаунт создан. Теперь можно войти.",
          })
        }
        onBack={() => onNavigate(AUTH_SCREENS.LOGIN)}
      />
    </AuthLayout>
  );
}
