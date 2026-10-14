import { useEffect } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { useWorldStore } from "@features/world/model/useWorldStore.js";

/**
 * WorldMapPage — карта мира: города, открытые игроку по уровню.
 * Клик по городу открывает «Миссии» с локациями этого города.
 */
export function WorldMapPage({ navigate }) {
  const map = useWorldStore((s) => s.map);
  const mapError = useWorldStore((s) => s.mapError);
  const loadMap = useWorldStore((s) => s.loadMap);

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Карта мира</h1>
      <PageState loading={!map && !mapError} error={mapError}>
        {map && (
          <div className="list-group">
            {map.map((city) => (
              <button
                key={city.id}
                type="button"
                className="list-group-item list-group-item-action d-flex align-items-center gap-3"
                onClick={() => navigate("missions", { cityId: city.id })}
              >
                <MapPin size={20} className="flex-shrink-0" />
                <span className="flex-grow-1 fw-semibold">{city.name}</span>
                {city.isCurrent && (
                  <span className="badge text-bg-primary">Вы здесь</span>
                )}
                <ChevronRight size={18} className="flex-shrink-0 text-muted" />
              </button>
            ))}
          </div>
        )}
      </PageState>
    </div>
  );
}
