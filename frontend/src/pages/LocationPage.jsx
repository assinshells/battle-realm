import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { useWorldStore } from "@features/world/model/useWorldStore.js";
import { LocationMissions } from "@widgets/world/ui/LocationMissions.jsx";

/**
 * LocationPage — страница локации (открывается из «Миссий»): светлые и тёмные
 * миссии, свободные очки миссий. Пункт меню «Миссии» остаётся подсвеченным.
 */
export function LocationPage({ navigate, params }) {
  const { locationId } = params;

  const locationData = useWorldStore((s) => s.location);
  const locationKey = useWorldStore((s) => s.locationKey);
  const locationError = useWorldStore((s) => s.locationError);
  const loadLocation = useWorldStore((s) => s.loadLocation);

  useEffect(() => {
    loadLocation(locationId);
  }, [loadLocation, locationId]);

  // Показываем только ту локацию, которая запрошена сейчас (не прошлую).
  const location = locationKey === String(locationId) ? locationData : null;

  return (
    <div className="container-fluid p-4">
      <h1 className="visually-hidden">Локация</h1>

      <button
        type="button"
        className="btn btn-link p-0 mb-3 d-inline-flex align-items-center gap-1"
        onClick={() =>
          navigate("missions", location ? { cityId: location.cityId } : {})
        }
      >
        <ArrowLeft size={16} />
        {location ? `Локации: ${location.cityName}` : "К локациям"}
      </button>

      <PageState loading={!location && !locationError} error={locationError}>
        {location && <LocationMissions location={location} />}
      </PageState>
    </div>
  );
}
