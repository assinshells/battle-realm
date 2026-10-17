import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { PageState } from "@shared/ui/PageState.jsx";
import { useWorldStore } from "@features/world/model/useWorldStore.js";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";
import { BusyStub } from "@widgets/progress/ui/BusyStub.jsx";
import { LocationMissions } from "@widgets/world/ui/LocationMissions.jsx";
import { useActivity } from "@features/missions/model/useActivity.js";

/**
 * LocationPage — страница локации (открывается из «Миссий»): светлые и тёмные
 * миссии, свободные очки миссий. Кнопка миссии сразу проводит бой и открывает
 * итог. Если персонаж занят, вместо карточки показывается таймер. Пункт меню
 * «Миссии» остаётся подсвеченным.
 */
export function LocationPage({ navigate, params }) {
  const { locationId } = params;

  const locationData = useWorldStore((s) => s.location);
  const locationKey = useWorldStore((s) => s.locationKey);
  const locationError = useWorldStore((s) => s.locationError);
  const loadLocation = useWorldStore((s) => s.loadLocation);

  const missionState = useMissionStore((s) => (s.loaded ? s : null));
  const { activity, nowMs } = useActivity();
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

      {!missionState ? (
        <PageState loading={!missionError} />
      ) : activity ? (
        <BusyStub activity={activity} nowMs={nowMs} navigate={navigate} />
      ) : (
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
      )}
    </div>
  );
}
