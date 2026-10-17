import { useEffect } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { BusyStub } from "@widgets/progress/ui/BusyStub.jsx";
import { useWorldStore } from "@features/world/model/useWorldStore.js";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";
import { useActivity } from "@features/missions/model/useActivity.js";

/**
 * MissionsPage — миссии: город и его локации.
 * По умолчанию показывает город, в котором игрок находится сейчас;
 * с карты мира открывается выбранный город (params.cityId).
 * Клик по локации открывает её страницу. Если персонаж занят (работа или
 * ожидание после миссии), вместо списка показывается таймер.
 */
export function MissionsPage({ params, navigate }) {
  const cityRef = params.cityId ?? "current";

  const cityData = useWorldStore((s) => s.city);
  const cityKey = useWorldStore((s) => s.cityKey);
  const cityError = useWorldStore((s) => s.cityError);
  const loadCity = useWorldStore((s) => s.loadCity);

  const loadMissionState = useMissionStore((s) => s.loadState);
  const missionError = useMissionStore((s) => s.error);
  const { loaded, activity, nowMs } = useActivity();

  useEffect(() => {
    loadCity(cityRef);
    loadMissionState();
  }, [loadCity, loadMissionState, cityRef]);

  // Показываем только город, который запрошен сейчас (не прошлый).
  const city = cityKey === String(cityRef) ? cityData : null;

  let content;
  if (!loaded) {
    content = <PageState loading={!missionError} error={missionError} />;
  } else if (activity) {
    content = <BusyStub activity={activity} nowMs={nowMs} navigate={navigate} />;
  } else {
    content = (
      <PageState loading={!city && !cityError} error={cityError}>
        {city && (
          <>
            <h2 className="h5 d-flex align-items-center gap-2 mb-3">
              <MapPin size={20} />
              {city.name}
              {city.isCurrent && (
                <span className="badge text-bg-primary fw-normal">Вы здесь</span>
              )}
            </h2>

            <h3 className="h6 text-muted mb-2">Локации</h3>
            <div className="list-group">
              {city.locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                  onClick={() => navigate("location", { locationId: location.id })}
                >
                  <span className="fw-semibold">{location.name}</span>
                  <ChevronRight size={18} className="flex-shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </>
        )}
      </PageState>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Миссии</h1>
      {content}
    </div>
  );
}
