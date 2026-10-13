import { useEffect, useState } from "react";
import { useLoginStore } from "@features/auth/login/model/useLoginStore.js";

/**
 * LoginForm — вход по e-mail и паролю.
 * onSuccess(email) — вызывается после успешного входа.
 * notice — необязательное сообщение сверху (например, "Аккаунт создан").
 */
export function LoginForm({ onSuccess, onRegister, onForgot, notice }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, login, clearError } = useLoginStore();

  // Состояние стора общее на всё приложение — сбрасываем ошибку прошлой
  // попытки при открытии экрана.
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    const trimmed = email.trim();
    login({ email: trimmed, password }, () => onSuccess(trimmed));
  };

  return (
    <>
      {notice && !error && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-100">
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
        <button type="button" className="btn btn-link p-0" onClick={onForgot}>
          Забыли пароль?
        </button>
        <button type="button" className="btn btn-link p-0" onClick={onRegister}>
          Создать аккаунт
        </button>
      </div>
    </>
  );
}
