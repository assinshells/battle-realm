import { useEffect, useState } from "react";
import { Coins, Moon, Sun } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { useWorkStore } from "@features/work/model/useWorkStore.js";

const KARMA_NAMES = { light: "светлой кармы", dark: "тёмной кармы" };

const pad = (n) => String(n).padStart(2, "0");
const formatDuration = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${pad(h)}:${pad(m)}:${pad(total % 60)}`;
};

/** Строка «+X серебра, +K светлой кармы» для награды. */
function RewardLine({ reward }) {
  const KarmaIcon = reward.karmaKind === "dark" ? Moon : Sun;
  return (
    <span className="d-inline-flex flex-wrap align-items-center column-gap-3">
      <span className="d-inline-flex align-items-center gap-1">
        <Coins size={16} />
        {reward.silver} серебра
      </span>
      {reward.karma > 0 && (
        <span className="d-inline-flex align-items-center gap-1">
          <KarmaIcon size={16} />+{reward.karma} {KARMA_NAMES[reward.karmaKind]}
        </span>
      )}
    </span>
  );
}

/**
 * WorkProgressPage — прогресс текущей работы по серверному времени и кнопка
 * «Отменить работу» (ничего не зачисляется). По окончании времени сервер
 * зачисляет награду, и страница показывает результат.
 */
export function WorkProgressPage({ navigate }) {
  const active = useWorkStore((s) => s.active);
  const loaded = useWorkStore((s) => s.loaded);
  const error = useWorkStore((s) => s.error);
  const result = useWorkStore((s) => s.result);
  const busy = useWorkStore((s) => s.busy);
  const offsetMs = useWorkStore((s) => s.offsetMs);
  const loadWork = useWorkStore((s) => s.loadWork);
  const cancel = useWorkStore((s) => s.cancel);

  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    loadWork();
  }, [loadWork]);

  // Раз в секунду обновляем время; когда время работы вышло — спрашиваем
  // сервер: он зачислит награду и вернёт результат.
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      const { active: job, offsetMs: offset, loadWork: reload } =
        useWorkStore.getState();
      if (job && Date.parse(job.endsAt) <= Date.now() + offset) reload();
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleCancel = async () => {
    if (await cancel()) navigate("work");
  };

  let content;
  if (active) {
    const start = Date.parse(active.startedAt);
    const end = Date.parse(active.endsAt);
    const serverNow = now + offsetMs;
    const elapsed = Math.min(Math.max(serverNow - start, 0), end - start);
    const percent = Math.floor((elapsed / (end - start)) * 100);

    content = (
      <div className="card">
        <div className="card-body">
          <h2 className="h5 mb-1">{active.typeName}</h2>
          <p className="text-muted">Время работы: {active.hours} ч.</p>

          <div className="d-flex justify-content-between mb-1">
            <span>Осталось: {formatDuration(end - serverNow)}</span>
            <span className="fw-semibold">{percent}%</span>
          </div>
          <div
            className="progress mb-3"
            role="progressbar"
            aria-label="Прогресс работы"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="mb-4">
            По окончании будет начислено: <RewardLine reward={active.reward} />
          </p>

          {confirming ? (
            <div className="alert alert-warning mb-0" role="alert">
              <p className="mb-2">
                Если отменить работу, награда начислена не будет. Отменить?
              </p>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={busy}
                  onClick={handleCancel}
                >
                  Да, отменить
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={busy}
                  onClick={() => setConfirming(false)}
                >
                  Нет
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => setConfirming(true)}
            >
              Отменить работу
            </button>
          )}
        </div>
      </div>
    );
  } else if (result) {
    content = (
      <div className="alert alert-success" role="status">
        <h2 className="h5">Работа завершена: {result.typeName}</h2>
        <p className="mb-3">
          Начислено: <RewardLine reward={result.reward} />
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("work")}
        >
          Выбрать новую работу
        </button>
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
