import { useEffect, useState } from "react";
import { useResetPasswordStore } from "@features/auth/reset-password/model/useResetPasswordStore.js";
import { PASSWORD_MIN_LENGTH } from "@shared/constants/auth.constants.js";

export function ResetPasswordForm({ verifiedToken, onSuccess, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, error, reset, clearError } = useResetPasswordStore();

  // Состояние стора общее на всё приложение — сбрасываем ошибку прошлой
  // попытки при открытии экрана.
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    reset({ verifiedToken, password, confirmPassword }, onSuccess);
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            Новый пароль
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          <div className="form-text">
            Не короче {PASSWORD_MIN_LENGTH} символов.
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="confirmPassword">
            Повторите пароль
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-100">
          {loading ? "Сохраняем…" : "Сохранить пароль"}
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
