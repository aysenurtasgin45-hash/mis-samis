import type { LucideIcon } from "lucide-react";

type Item = {
  label: string;
  value: string;
  tone?: "green" | "amber" | "red";
};

export function DashboardCard({
  title,
  icon: Icon,
  items
}: {
  title: string;
  icon: LucideIcon;
  items: Item[];
}) {
  return (
    <section className="dashboard-panel" id={title.toLowerCase().split(" ")[0]}>
      <div className="panel-header">
        <h3>{title}</h3>
        <span className="icon-box" aria-hidden="true">
          <Icon size={20} />
        </span>
      </div>
      <ul className="status-list">
        {items.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <strong className={item.tone ? `pill ${item.tone}` : "pill"}>{item.value}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
