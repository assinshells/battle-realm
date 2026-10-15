import { useEffect } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { useWorldStore } from "@features/world/model/useWorldStore.js";

/**
 * MissionsPage — миссии: город и его локации.
 * По умолчанию показывает город, в котором игрок находится сейчас;
 * с карты мира открывается выбранный город (params.cityId).
 * Клик по локации открывает её страницу.
 */
export function MissionsPage({ params, navigate }) {
  const cityRef = params.cityId ?? "current";

  const cityData = useWorldStore((s) => s.city);
  const cityKey = useWorldStore((s) => s.cityKey);
  const cityError = useWorldStore((s) => s.cityError);
  const loadCity = useWorldStore((s) => s.loadCity);

  useEffect(() => {
    loadCity(cityRef);
  }, [loadCity, cityRef]);

  // Показываем только город, который запрошен сейчас (не прошлый).
  const city = cityKey === String(cityRef) ? cityData : null;

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Миссии</h1>
      <PageState loading={!city && !cityError} error={cityError}>
        {city && (
          <>
            <h2 className="h5 d-flex align-items-center gap-2 mb-3">
              <MapPin size={20} />
              {city.name}
              {city.isCurrent && (
                <span className="badge text-bg-primary fw-normal">
                  Вы здесь
                </span>
              )}
            </h2>

            <h3 className="h6 text-muted mb-2">Локации</h3>
            <div className="list-group">
              {city.locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                  onClick={() =>
                    navigate("location", { locationId: location.id })
                  }
                >
                  <span className="fw-semibold">{location.name}</span>
                  <ChevronRight size={18} className="flex-shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </>
        )}
      </PageState>
    </div>
  );
}
