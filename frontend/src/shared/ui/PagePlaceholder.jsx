/**
 * PagePlaceholder — общая заглушка для разделов, которые ещё не сделаны.
 */
export function PagePlaceholder({ title, icon: Icon, children }) {
  return (
    <div className="container-fluid p-4">
      <h1 className="h3 d-flex align-items-center gap-2 mb-3">
        {Icon && <Icon size={28} />}
        {title}
      </h1>
      <p className="text-muted mb-0">{children ?? "Раздел в разработке."}</p>
    </div>
  );
}
