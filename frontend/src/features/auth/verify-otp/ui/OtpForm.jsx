import { useRef, useEffect, useState } from "react";
import { useVerifyOtpStore } from "@features/auth/verify-otp/model/useVerifyOtpStore.js";

export function OtpForm({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const { loading, error, verify, clearError } = useVerifyOtpStore();

  // Состояние стора общее на всё приложение — сбрасываем ошибку прошлой
  // попытки при открытии экрана.
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (index, value) => {
    // Только цифры
    const digit = value.replace(/\D/g, "").slice(-1);

    if (!digit) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);
    clearError();

    // Перейти к следующей ячейке
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace — удалить текущую цифру
    // Если ячейка пустая — перейти назад
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Стрелка влево
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Стрелка вправо
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedCode = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedCode) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedCode.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    clearError();

    // Фокус на последнюю заполненную ячейку
    const focusIndex = Math.min(pastedCode.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return;
    }

    clearError();
    verify({ email, otpCode }, onSuccess);
  };

  const isComplete = otp.every(Boolean);

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="form-control form-control-lg text-center px-0"
              aria-label={`Цифра кода ${index + 1} из 6`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !isComplete}
          className="btn btn-primary w-100"
        >
          {loading ? "Проверяем…" : "Подтвердить"}
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
