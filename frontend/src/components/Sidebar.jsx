import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Car,
  ListOrdered,
} from "lucide-react";

const items = [
  { to: "/dashboard", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/offer", label: "Offer ride", icon: Car },
  { to: "/dashboard/find", label: "Find ride", icon: Search },
  { to: "/dashboard/myrides", label: "My rides", icon: ListOrdered },
];

export default function Sidebar() {
  return (
    <aside className="flex w-full flex-col border-b border-slate-200/80 bg-white lg:w-64 lg:border-b-0 lg:border-r lg:border-slate-200/80">
      <div className="border-b border-slate-100 px-5 py-6 lg:border-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
          Dashboard
        </p>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:py-4 lg:pb-6">
        {items.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-white text-brand-600 shadow-sm"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="pr-2 whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
