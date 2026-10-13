/**
 * InfoList — список «название — значение» (Bootstrap list-group).
 * rows: [{ label, value }]
 * padded — боковые отступы строк (false — когда список уже внутри card-body).
 */
export function InfoList({ rows, padded = true }) {
  return (
    <ul className="list-group list-group-flush">
      {rows.map(({ label, value }) => (
        <li
          key={label}
          className={`list-group-item d-flex justify-content-between gap-3 ${
            padded ? "" : "px-0"
          }`}
        >
          <span>{label}</span>
          <span className="fw-semibold text-end">{value}</span>
        </li>
      ))}
    </ul>
  );
}

/** InfoCard — карточка с заголовком и списком «название — значение». */
export function InfoCard({ title, rows }) {
  return (
    <div className="card h-100">
      <div className="card-header fw-semibold">{title}</div>
      <InfoList rows={rows} />
    </div>
  );
}
