import { formatDuration } from "@shared/lib/formatDuration.js";

/**
 * TimedProgress — прогресс ожидания по времени: «Осталось ЧЧ:ММ:СС»,
 * процент, полоса и сообщение под ней. Подходит для любого ожидания
 * в игре (работа и другие занятия на время), поэтому знает только о времени.
 *
 * startMs, endMs — начало и конец (мс), nowMs — текущее серверное время (мс),
 * label          — подпись полосы для скринридеров,
 * message        — текст под полосой, children — кнопки действий.
 */
export function TimedProgress({
  startMs,
  endMs,
  nowMs,
  label = "Прогресс",
  message,
  children,
}) {
  const elapsed = Math.min(Math.max(nowMs - startMs, 0), endMs - startMs);
  const percent = Math.floor((elapsed / (endMs - startMs)) * 100);

  return (
    <>
      <div className="d-flex justify-content-between mb-1">
        <span>Осталось: {formatDuration(endMs - nowMs)}</span>
        <span className="fw-semibold">{percent}%</span>
      </div>
      <div
        className="progress mb-3"
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          style={{ width: `${percent}%` }}
        />
      </div>
      {message && <p className="mb-3">{message}</p>}
      {children}
    </>
  );
}
