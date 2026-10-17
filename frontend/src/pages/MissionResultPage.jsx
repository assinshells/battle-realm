import { useEffect, useState } from "react";
import { Coins, Heart, MapPin, Star } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { KarmaAmount } from "@shared/ui/KarmaAmount.jsx";
import { KARMA_KINDS } from "@shared/constants/karma.constants.js";
import { TimedProgress } from "@widgets/progress/ui/TimedProgress.jsx";
import { BattleReport } from "@widgets/missions/ui/BattleReport.jsx";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";

const AWAY_MESSAGE =
  "Сейчас вы отсутствуете, так как зарабатываете себе на жизнь.";

/**
 * MissionResultPage — итог миссии: лог боя выдаётся сразу, награда уже
 * зачислена, а таймер показывает, сколько ещё игрок «отсутствует». Отмены
 * нет: пока таймер идёт, нельзя брать работу и новую миссию.
 */
export function MissionResultPage({ navigate }) {
  const run = useMissionStore((s) => s.run);
  const loaded = useMissionStore((s) => s.loaded);
  const error = useMissionStore((s) => s.error);
  const offsetMs = useMissionStore((s) => s.offsetMs);
  const loadState = useMissionStore((s) => s.loadState);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    loadState();
  }, [loadState]);

  // Награда уже зачислена, поэтому серверу о конце ожидания можно не сообщать:
  // таймер просто доходит до нуля по серверному времени.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const result = run?.result;
  const endMs = run ? Date.parse(run.endsAt) : 0;
  const waiting = run ? now + offsetMs < endMs : false;

  let content;
  if (!result) {
    content = (
      <div className="card">
        <div className="card-body">
          <p>Вы ещё не ходили на миссии.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("missions")}>
            К миссиям
          </button>
        </div>
      </div>
    );
  } else {
    const { totals } = result;
    const kind = KARMA_KINDS[result.kind];
    const KindIcon = kind.icon;

    content = (
      <>
        <div className="card mb-4">
          <div className="card-body">
            {waiting ? (
              <TimedProgress
                startMs={Date.parse(run.startedAt)}
                endMs={endMs}
                nowMs={now + offsetMs}
                label="Ожидание после миссии"
                message={AWAY_MESSAGE}
              />
            ) : (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <span>Вы вернулись. Можно отправляться на новую миссию.</span>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("missions")}
                >
                  К миссиям
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex flex-wrap align-items-center gap-2">
            <span className="d-inline-flex align-items-center gap-1 fw-semibold">
              <MapPin size={16} aria-hidden="true" />
              {result.locationName}
            </span>
            <span className="d-inline-flex align-items-center gap-1 text-muted">
              <KindIcon size={16} aria-hidden="true" />
              {result.kind === "light" ? "Светлая" : "Тёмная"} миссия, {result.minutes} мин.
            </span>
          </div>
          <div className="card-body">
            <h2 className="h6 text-muted">Итого за миссию</h2>
            <div className="d-flex flex-wrap column-gap-4 row-gap-2 fs-5">
              <span className="d-inline-flex align-items-center gap-1" title="Серебро">
                <Coins size={20} aria-hidden="true" />
                <strong>{totals.silver}</strong>
              </span>
              <span className="d-inline-flex align-items-center gap-1" title="Опыт">
                <Star size={20} aria-hidden="true" />
                <strong>{totals.xp}</strong>
              </span>
              {totals.karma > 0 && (
                <KarmaAmount kind={result.kind} amount={totals.karma} />
              )}
              <span className="d-inline-flex align-items-center gap-1" title="Потеряно жизней">
                <Heart size={20} aria-hidden="true" />
                <strong>−{totals.hpLost}</strong>
              </span>
            </div>
            {totals.levelsGained > 0 && (
              <div className="alert alert-success mt-3 mb-0" role="status">
                Новый уровень: {totals.levelAfter}!
              </div>
            )}
            <div className="small text-muted mt-2">
              Награда уже зачислена. Побед: {totals.wins}, ничьих: {totals.draws}, поражений:{" "}
              {totals.losses}.
            </div>
          </div>
        </div>

        <h2 className="h5 mb-3">Итог боя</h2>
        {result.encounters.map((encounter) => (
          <div key={encounter.index}>
            {result.encounters.length > 1 && (
              <h3 className="h6 border-bottom pb-1 mb-3">Бой {encounter.index + 1}</h3>
            )}
            <BattleReport encounter={encounter} hero={result.hero} />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Итог миссии</h1>
      <PageState loading={!loaded && !error} error={!loaded ? error : null}>
        {content}
      </PageState>
    </div>
  );
}
