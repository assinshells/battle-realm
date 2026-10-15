import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { KarmaAmount } from "@shared/ui/KarmaAmount.jsx";
import { TimedProgress } from "@widgets/progress/ui/TimedProgress.jsx";
import { useWorkStore } from "@features/work/model/useWorkStore.js";

const POLL_SECONDS = 5;

const AWAY_MESSAGE =
  "Сейчас вы отсутствуете, так как зарабатываете себе на жизнь.";

/**
 * WorkProgressPage — страница текущей работы по серверному времени:
 *  - пока идёт время: прогресс с общей фразой и «Отменить работу»
 *    (отмена сразу, без подтверждения, ничего не зачисляется);
 *  - когда время вышло: «Во время работы вы заработали: …» и кнопка
 *    «Принять оплату» — серебро и карма зачисляются только по ней.
 */
export function WorkProgressPage({ navigate }) {
  const active = useWorkStore((s) => s.active);
  const loaded = useWorkStore((s) => s.loaded);
  const error = useWorkStore((s) => s.error);
  const busy = useWorkStore((s) => s.busy);
  const offsetMs = useWorkStore((s) => s.offsetMs);
  const loadWork = useWorkStore((s) => s.loadWork);
  const cancel = useWorkStore((s) => s.cancel);
  const claim = useWorkStore((s) => s.claim);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    loadWork();
  }, [loadWork]);

  // Раз в секунду обновляем время. Пока работа идёт, раз в POLL_SECONDS
  // секунд сверяемся с сервером (время окончания могло измениться), а когда
  // время вышло — спрашиваем сразу: сервер подтвердит, что оплату можно принять.
  useEffect(() => {
    let ticks = 0;
    const id = setInterval(() => {
      ticks += 1;
      setNow(Date.now());
      const { active: job, offsetMs: offset, loadWork: reload } =
        useWorkStore.getState();
      if (!job || job.finished) return;

      const timeIsUp = Date.parse(job.endsAt) <= Date.now() + offset;
      if (timeIsUp || ticks % POLL_SECONDS === 0) reload();
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleCancel = async () => {
    if (await cancel()) navigate("work");
  };

  const handleClaim = async () => {
    if (await claim()) navigate("work");
  };

  let content;
  if (active && !active.finished) {
    content = (
      <div className="card">
        <div className="card-body">
          <TimedProgress
            startMs={Date.parse(active.startedAt)}
            endMs={Date.parse(active.endsAt)}
            nowMs={now + offsetMs}
            label="Прогресс работы"
            message={AWAY_MESSAGE}
          >
            <button
              type="button"
              className="btn btn-outline-danger"
              disabled={busy}
              onClick={handleCancel}
            >
              Отменить работу
            </button>
          </TimedProgress>
        </div>
      </div>
    );
  } else if (active) {
    const { reward } = active;
    content = (
      <div className="card">
        <div className="card-body">
          <h2 className="h5 mb-3">Во время работы вы заработали:</h2>
          <p className="d-flex flex-wrap align-items-center column-gap-4 row-gap-2 fs-5 mb-4">
            <span
              className="d-inline-flex align-items-center gap-1"
              title="Серебро"
              aria-label={`Серебро: ${reward.silver}`}
            >
              <Coins size={20} className="flex-shrink-0" aria-hidden="true" />
              <span className="fw-semibold">{reward.silver}</span>
            </span>
            {reward.karma > 0 && (
              <KarmaAmount kind={reward.karmaKind} amount={reward.karma} />
            )}
          </p>
          <button
            type="button"
            className="btn btn-success"
            disabled={busy}
            onClick={handleClaim}
          >
            Принять оплату
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="card">
        <div className="card-body">
          <p>Сейчас вы не работаете.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("work")}
          >
            Выбрать работу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Работа</h1>
      {error && loaded && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <PageState loading={!loaded && !error} error={!loaded ? error : null}>
        {content}
      </PageState>
    </div>
  );
}
