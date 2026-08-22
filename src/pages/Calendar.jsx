import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { getTrip } from "../lib/store";
import { money } from "../lib/utils";
import { Loading, PageHeader, ImageWithFallback } from "../components/UI";
import TripNav from "../components/TripNav";
export default function CalendarPage() {
  const { tripId } = useParams(),
    [trip, setTrip] = useState(null),
    [month, setMonth] = useState(new Date()),
    [selected, setSelected] = useState(null);
  useEffect(() => {
    getTrip(tripId).then((t) => {
      setTrip(t);
      setSelected(t?.start_date || null);
    });
  }, [tripId]);
  const items = useMemo(
    () =>
      trip
        ? (trip.trip_stops || []).flatMap((s) =>
            (s.trip_activities || []).map((a) => ({
              ...a,
              city: s.city,
              city_id: s.city_id,
            })),
          )
        : [],
    [trip],
  );
  const byDate = useMemo(
    () =>
      items.reduce((o, a) => {
        (o[a.scheduled_date || "unscheduled"] ??= []).push(a);
        return o;
      }, {}),
    [items],
  );
  if (!trip) return <Loading />;
  const days = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    }),
    selectedItems = byDate[selected] || [];
  return (
    <div className="page">
      <PageHeader
        eyebrow={trip.name}
        title="What's happening and when?"
        description="A clear calendar for every experience in your journey."
      />
      <TripNav id={tripId} />
      <div className="grid lg:grid-cols-[1fr_330px] gap-7">
        <section className="surface rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              className="icon-btn"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-2xl font-bold">{format(month, "MMMM yyyy")}</h2>
            <button
              className="icon-btn"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-black/40 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd"),
                has = Boolean(byDate[key]?.length);
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={`min-h-16 sm:min-h-24 p-2 rounded-lg text-left border ${selected === key ? "border-accent bg-orange-50" : "border-transparent hover:bg-black/[.03]"} ${!isSameMonth(day, month) ? "opacity-30" : ""}`}
                >
                  <span className="text-sm font-bold">{format(day, "d")}</span>
                  {has && (
                    <span className="block mt-2 size-2 rounded-full bg-accent" />
                  )}
                  <span className="hidden sm:block text-[10px] mt-1 text-black/45">
                    {has ? `${byDate[key].length} planned` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <aside className="surface rounded-xl p-6 h-fit lg:sticky lg:top-24">
          <p className="text-xs font-bold tracking-widest text-accent">
            SELECTED DAY
          </p>
          <h2 className="text-2xl font-bold mt-2">
            {selected ? format(parseISO(selected), "dd MMMM") : "Choose a date"}
          </h2>
          <div className="mt-5 space-y-3">
            {selectedItems.map((a) => (
              <Link
                to={`/explore/activities/${a.activity?.id}`}
                key={a.id}
                className="flex gap-3 border-t border-black/10 pt-3"
              >
                <ImageWithFallback
                  src={a.activity?.image_url}
                  alt={a.activity?.name}
                  className="size-14 rounded-lg object-cover"
                />
                <span>
                  <b className="block">
                    {a.scheduled_time || "--:--"} · {a.activity?.name}
                  </b>
                  <small className="text-black/45">
                    <MapPin size={12} className="inline" /> {a.city?.name} ·{" "}
                    {money(a.custom_cost ?? a.activity?.cost)}
                  </small>
                </span>
              </Link>
            ))}
            {selected && !selectedItems.length && (
              <p className="text-black/45 py-5">Nothing planned yet.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
