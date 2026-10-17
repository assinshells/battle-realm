import { Coins, Heart, MapPin, Star } from "lucide-react";
import { KarmaAmount } from "@shared/ui/KarmaAmount.jsx";
import { KARMA_KINDS } from "@shared/constants/karma.constants.js";
import { BattleReport } from "@widgets/missions/ui/BattleReport.jsx";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";

/**
 * MissionResultPage — итог миссии, который показывается ОДИН раз сразу после
 * боя (награда уже зачислена). Таймера здесь нет: ожидание после миссии
 * показывают страницы миссий и работы. Когда игрок уходит со страницы, итог
 * сбрасывается (позже он будет приходить в сообщения).
 */
export function MissionResultPage() {
  const result = useMissionStore((s) => s.result);

  if (!result) {
    return (
      <div className="container-fluid p-4">
        <h1 className="h3 mb-3">Итог миссии</h1>
        <div className="card">
          <div className="card-body">
            <p className="mb-0">Итог миссии недоступен.</p>
          </div>
        </div>
      </div>
    );
  }

  const { totals } = result;
  const KindIcon = KARMA_KINDS[result.kind].icon;

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Итог миссии</h1>

      <div className="card mb-4">
        <div className="card-header d-flex flex-wrap align-items-center gap-2">
          <span className="d-inline-flex align-items-center gap-1 fw-semibold">
            <MapPin size={16} aria-hidden="true" />
            {result.locationName}
          </span>
          <span className="d-inline-flex align-items-center gap-1 text-muted">
            <KindIcon size={16} aria-hidden="true" />
            {result.kind === "light" ? "Светлая" : "Тёмная"} миссия
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
            {totals.karma > 0 && <KarmaAmount kind={result.kind} amount={totals.karma} />}
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
    </div>
  );
}
