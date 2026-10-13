import { useEffect, useState } from "react";
import { useRegisterStore } from "@features/auth/register/model/useRegisterStore.js";
import {
  HERO_NAME_MAX,
  HERO_NAME_MIN,
  PASSWORD_MIN_LENGTH,
} from "@shared/constants/auth.constants.js";

export function RegisterForm({ onSuccess, onBack }) {
  const [heroName, setHeroName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, register, clearError } = useRegisterStore();

  // Состояние стора общее на всё приложение — сбрасываем ошибку прошлой
  // попытки при открытии экрана.
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    register(
      { heroName: heroName.trim(), email: email.trim(), password },
      onSuccess,
    );
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
          <label className="form-label" htmlFor="heroName">
            Имя героя
          </label>
          <input
            id="heroName"
            type="text"
            className="form-control"
            autoComplete="nickname"
            minLength={HERO_NAME_MIN}
            maxLength={HERO_NAME_MAX}
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            required
            autoFocus
          />
          <div className="form-text">
            {HERO_NAME_MIN}–{HERO_NAME_MAX} символов: буквы, цифры, пробел, «_»
            и «-».
          </div>
        </div>

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
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="form-text">
            Не короче {PASSWORD_MIN_LENGTH} символов.
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-100">
          {loading ? "Создаём…" : "Создать аккаунт"}
        </button>
      </form>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
        <button type="button" className="btn btn-link p-0" onClick={onBack}>
          Уже есть аккаунт? Войти
        </button>
      </div>
    </>
  );
}
