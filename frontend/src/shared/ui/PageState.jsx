/**
 * PageState — состояние загрузки страницы: ошибка, индикатор или контент.
 *
 * loading  — данные ещё загружаются,
 * error    — текст ошибки (если загрузка не удалась),
 * children — контент, показывается, когда нет ни загрузки, ни ошибки.
 */
export function PageState({ loading, error, children }) {
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Загрузка…</span>
        </div>
      </div>
    );
  }
  return children;
}
