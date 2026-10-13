import { useEffect, useState } from "react";
import { useForgotPasswordStore } from "@features/auth/forgot-password/model/useForgotPasswordStore.js";

export function ForgotPasswordForm({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const { loading, error, submit, clearError } = useForgotPasswordStore();

  // Состояние стора общее на всё приложение — сбрасываем ошибку прошлой
  // попытки при открытии экрана.
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    const trimmed = email.trim();
    submit({ email: trimmed }, () => onSuccess(trimmed));
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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

        <button type="submit" disabled={loading} className="btn btn-primary w-100">
          {loading ? "Отправляем…" : "Отправить код"}
        </button>
      </form>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
        <button type="button" className="btn btn-link p-0" onClick={onBack}>
          Вернуться ко входу
        </button>
      </div>
    </>
  );
}
