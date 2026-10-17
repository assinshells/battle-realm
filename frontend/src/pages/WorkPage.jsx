import { useEffect, useState } from "react";
import { PageState } from "@shared/ui/PageState.jsx";
import { useWorkStore } from "@features/work/model/useWorkStore.js";
import { BusyStub } from "@widgets/progress/ui/BusyStub.jsx";
import { WorkCard } from "@widgets/work/ui/WorkCard.jsx";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";
import { useActivity } from "@features/missions/model/useActivity.js";

/**
 * WorkPage — выбор работы: ползунок времени 1–8 часов и три карточки
 * (охрана ворот, работа в поле, грабёж). «Взять работу» открывает страницу
 * с прогрессом. Если работа уже идёт, сразу открывается она. Если персонаж
 * ждёт после миссии, вместо выбора показывается таймер.
 */
export function WorkPage({ navigate }) {
  const catalog = useWorkStore((s) => s.catalog);
  const error = useWorkStore((s) => s.error);
  const busy = useWorkStore((s) => s.busy);
  const loadWork = useWorkStore((s) => s.loadWork);
  const start = useWorkStore((s) => s.start);
  const loadMissionState = useMissionStore((s) => s.loadState);
  const { loaded: missionLoaded, activity, nowMs } = useActivity();
  const [hours, setHours] = useState(1);

  useEffect(() => {
    // Решение «работа уже идёт?» принимаем по свежему ответу сервера.
    loadMissionState();
    loadWork().then(() => {
      if (useWorkStore.getState().active) navigate("work-progress");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- только при открытии
  }, [loadWork, loadMissionState]);

  const handleTake = async (typeId) => {
    if (await start(typeId, hours)) navigate("work-progress");
  };

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Работа</h1>

      {error && catalog && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <PageState
        loading={(!catalog && !error) || !missionLoaded}
        error={!catalog ? error : null}
      >
        {activity?.kind === "mission" ? (
          <BusyStub activity={activity} nowMs={nowMs} navigate={navigate} />
        ) : (
          catalog && (
          <>
            <div className="card mb-4">
              <div className="card-body">
                <label
                  htmlFor="work-hours"
                  className="form-label d-flex justify-content-between"
                >
                  <span>Время работы</span>
                  <span className="fw-semibold">{hours} ч.</span>
                </label>
                <input
                  id="work-hours"
                  type="range"
                  className="form-range"
                  min={catalog.minHours}
                  max={catalog.maxHours}
                  step={1}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted small px-1">
                  {Array.from(
                    { length: catalog.maxHours - catalog.minHours + 1 },
                    (_, i) => catalog.minHours + i,
                  ).map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-lg-3 g-3">
              {catalog.types.map((type) => (
                <div key={type.id} className="col">
                  <WorkCard
                    type={type}
                    hours={hours}
                    disabled={busy}
                    onTake={() => handleTake(type.id)}
                  />
                </div>
              ))}
            </div>
          </>
          )
        )}
      </PageState>
    </div>
  );
}
