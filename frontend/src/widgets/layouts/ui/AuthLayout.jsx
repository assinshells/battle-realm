import SimpleBar from "simplebar-react";
import { APP_NAME, LEGAL_LINKS } from "@shared/constants/auth.constants.js";

/**
 * AuthLayout — единый шаблон всех экранов авторизации
 * (вход, регистрация, восстановление пароля, код из письма, новый пароль).
 *
 * title    — заголовок экрана,
 * subtitle — короткое пояснение под заголовком,
 * children — форма.
 */
export function AuthLayout({ title, subtitle, children }) {
  return (
    <SimpleBar className="vh-100" autoHide={true}>
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
        <div className="container">
          <div className="w-100 mx-auto" style={{ maxWidth: "24.5rem" }}>
            <div className="text-center h3 mb-4">{APP_NAME}</div>

            <main className="card p-4 shadow-sm mb-3">
              <h1 className="h4 text-center mb-1">{title}</h1>
              {subtitle && (
                <p className="text-center text-muted text-break mb-4">
                  {subtitle}
                </p>
              )}
              {children}
            </main>

            <footer className="text-center text-muted small">
              Продолжая, вы соглашаетесь с{" "}
              <a
                href={LEGAL_LINKS.terms}
                target="_blank"
                rel="noopener noreferrer"
              >
                условиями использования
              </a>{" "}
              и{" "}
              <a
                href={LEGAL_LINKS.privacy}
                target="_blank"
                rel="noopener noreferrer"
              >
                политикой конфиденциальности
              </a>
              .
            </footer>
          </div>
        </div>
      </div>
    </SimpleBar>
  );
}
