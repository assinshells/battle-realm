import { Coins, Gem, Heart, Star } from "lucide-react";

const percent = (value, max) =>
  max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

/** Блок с полоской прогресса (жизни, опыт). */
function BarStat({
  icon: Icon,
  iconClass,
  label,
  value,
  max,
  barClass,
  hint,
}) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center small mb-1">
        <span className="d-flex align-items-center gap-1 text-truncate">
          <Icon size={16} className={`flex-shrink-0 ${iconClass}`} />
          {label}
        </span>
        <span className="fw-semibold ms-2">
          {value}/{max}
        </span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`progress-bar ${barClass}`}
          style={{ width: `${percent(value, max)}%` }}
        />
      </div>
      {hint && <small className="d-block text-muted mt-1">{hint}</small>}
    </>
  );
}

/** Блок с числом (серебро, рубины). */
function ValueStat({ icon: Icon, iconClass, label, value }) {
  return (
    <>
      <div className="d-flex align-items-center gap-1 small mb-1">
        <Icon size={16} className={`flex-shrink-0 ${iconClass}`} />
        <span className="text-truncate">{label}</span>
      </div>
      <div className="fw-semibold">{value.toLocaleString("ru-RU")}</div>
    </>
  );
}

/**
 * StatsBar — панель параметров героя, показывается над контентом на всех
 * страницах: уровень и опыт, жизни, серебро, рубины.
 *
 * stats — { level, hp, maxHp, xp, maxXp, silver, rubies }
 */
export function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <section
      className="border-bottom bg-body-tertiary px-3 py-2"
      aria-label="Параметры героя"
    >
      <div className="row g-3 align-items-start">
        <div className="col-6 col-md-4">
          <BarStat
            icon={Heart}
            iconClass="text-danger"
            label="Жизни"
            value={stats.hp}
            max={stats.maxHp}
            barClass="bg-danger"
            hint={`Восстановление: ${stats.hpRegenPerHour} пунктов жизни в час`}
          />
        </div>
        <div className="col-6 col-md-4">
          <BarStat
            icon={Star}
            iconClass="text-warning"
            label={`Уровень ${stats.level}`}
            value={stats.xp}
            max={stats.maxXp}
            barClass="bg-warning"
            hint={`До следующего уровня: ${Math.max(stats.maxXp - stats.xp, 0)} оч. опыта`}
          />
        </div>
        <div className="col-6 col-md-2">
          <ValueStat
            icon={Coins}
            iconClass="text-secondary"
            label="Серебро"
            value={stats.silver}
          />
        </div>
        <div className="col-6 col-md-2">
          <ValueStat
            icon={Gem}
            iconClass="text-danger"
            label="Рубины"
            value={stats.rubies}
          />
        </div>
      </div>
    </section>
  );
}
