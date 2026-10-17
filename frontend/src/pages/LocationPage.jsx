import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { useWorldStore } from "@features/world/model/useWorldStore.js";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";
import { LocationMissions } from "@widgets/world/ui/LocationMissions.jsx";

/**
 * LocationPage — страница локации (открывается из «Миссий»): светлые и тёмные
 * миссии, свободные очки миссий. Кнопка миссии сразу проводит бой и открывает
 * итог. Пункт меню «Миссии» остаётся подсвеченным.
 */
export function LocationPage({ navigate, params }) {
  const { locationId } = params;

  const locationData = useWorldStore((s) => s.location);
  const locationKey = useWorldStore((s) => s.locationKey);
  const locationError = useWorldStore((s) => s.locationError);
  const loadLocation = useWorldStore((s) => s.loadLocation);

  const missionState = useMissionStore((s) => (s.loaded ? s : null));
  const starting = useMissionStore((s) => s.starting);
  const missionError = useMissionStore((s) => s.error);
  const loadMissionState = useMissionStore((s) => s.loadState);
  const startMission = useMissionStore((s) => s.start);
  const clearMissionError = useMissionStore((s) => s.clearError);

  useEffect(() => {
    loadLocation(locationId);
    loadMissionState();
    clearMissionError();
  }, [loadLocation, loadMissionState, clearMissionError, locationId]);

  // Показываем только ту локацию, которая запрошена сейчас (не прошлую).
  const location = locationKey === String(locationId) ? locationData : null;

  const handleStart = async (kind, length) => {
    if (await startMission({ locationId: location.id, kind, length })) {
      navigate("mission-result");
    }
  };

  return (
    <div className="container-fluid p-4">
      <h1 className="visually-hidden">Локация</h1>

      <button
        type="button"
        className="btn btn-link p-0 mb-3 d-inline-flex align-items-center gap-1"
        onClick={() => navigate("missions", location ? { cityId: location.cityId } : {})}
      >
        <ArrowLeft size={16} />
        {location ? `Локации: ${location.cityName}` : "К локациям"}
      </button>

      {missionError && (
        <div className="alert alert-danger" role="alert">
          {missionError}
        </div>
      )}

      {missionState?.busy === "mission" && (
        <div className="alert alert-info d-flex flex-wrap align-items-center justify-content-between gap-2" role="status">
          <span>Вы отсутствуете после миссии. Дождитесь окончания ожидания.</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate("mission-result")}
          >
            Показать итог боя
          </button>
        </div>
      )}

      <PageState loading={!location && !locationError} error={locationError}>
        {location && (
          <LocationMissions
            location={location}
            state={missionState}
            starting={starting}
            onStart={handleStart}
          />
        )}
      </PageState>
    </div>
  );
}
