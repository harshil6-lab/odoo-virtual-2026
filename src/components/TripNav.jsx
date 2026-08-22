import { CalendarDays, ChartPie, Edit3, ListChecks } from "lucide-react";
import { NavLink } from "react-router-dom";
export default function TripNav({ id }) {
  const items = [
    [Edit3, "Overview", `/app/trips/${id}`],
    [ListChecks, "Itinerary", `/app/trips/${id}/itinerary`],
    [ChartPie, "Budget", `/app/trips/${id}/budget`],
    [CalendarDays, "Calendar", `/app/trips/${id}/calendar`],
  ];
  return (
    <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
      {items.map(([I, l, to]) => (
        <NavLink
          end
          key={to}
          to={to}
          className={({ isActive }) =>
            `shrink-0 inline-flex items-center gap-2 px-3.5 h-10 rounded-lg text-sm font-semibold ${isActive ? "bg-ink text-white" : "bg-white border border-black/[.07]"}`
          }
        >
          <I size={16} />
          {l}
        </NavLink>
      ))}
    </div>
  );
}
