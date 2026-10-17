import { TimedProgress } from "@widgets/progress/ui/TimedProgress.jsx";
import { AWAY_MESSAGE } from "@shared/constants/messages.js";

/**
 * BusyStub — заглушка вместо содержимого страницы (миссии, работа), пока
 * персонаж занят: показывает таймер и общую фразу.
 *
 * activity — { kind: "mission" | "work", startedAt, endsAt, finished },
 * nowMs    — серверное время (мс), navigate — переход на другую страницу.
 */
export function BusyStub({ activity, nowMs, navigate }) {
  const startMs = Date.parse(activity.startedAt);
  const endMs = Date.parse(activity.endsAt);
  const isWork = activity.kind === "work";
  const workDone = isWork && (activity.finished || nowMs >= endMs);

  return (
    <div className="card">
      <div className="card-body">
        {workDone ? (
          <>
            <p>Вы закончили работу. Примите оплату на странице работы.</p>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => navigate("work-progress")}
            >
              Принять оплату
            </button>
          </>
        ) : (
          <TimedProgress
            startMs={startMs}
            endMs={endMs}
            nowMs={nowMs}
            label="Прогресс"
            message={AWAY_MESSAGE}
          />
        )}
      </div>
    </div>
  );
}
