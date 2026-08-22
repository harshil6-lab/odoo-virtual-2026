import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";
import { getTrip, saveTrip } from "../lib/store";
import { EXPENSE_CATEGORIES } from "../lib/constants";
import { money, tripDays } from "../lib/utils";
import { Loading, PageHeader } from "../components/UI";
import TripNav from "../components/TripNav";
const colors = ["#f2683a", "#242424", "#e2a33a", "#4b8b7b", "#9c7cbb"];
export default function Budget() {
  const { tripId } = useParams(),
    [trip, setTrip] = useState(null),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    getTrip(tripId).then((t) =>
      setTrip({ ...t, trip_expenses: t.trip_expenses || [] }),
    );
  }, [tripId]);
  const data = useMemo(() => {
    if (!trip) return [];
    const at = (trip.trip_stops || [])
      .flatMap((s) => s.trip_activities || [])
      .reduce((n, a) => n + Number(a.custom_cost ?? a.activity?.cost ?? 0), 0);
    return EXPENSE_CATEGORIES.map((c) => ({
      name: c === "accommodation" ? "Stay" : c[0].toUpperCase() + c.slice(1),
      category: c,
      value:
        (trip.trip_expenses || [])
          .filter((e) => e.category === c)
          .reduce((n, e) => n + Number(e.amount || 0), 0) +
        (c === "activities" ? at : 0),
    })).filter((x) => x.value > 0);
  }, [trip]);
  if (!trip) return <Loading />;
  const total = data.reduce((n, x) => n + x.value, 0),
    limit = Number(trip.budget) || 0,
    acts = (trip.trip_stops || []).flatMap((s) => s.trip_activities || []);
  const add = () =>
    setTrip({
      ...trip,
      trip_expenses: [
        ...trip.trip_expenses,
        {
          id: crypto.randomUUID(),
          category: "transport",
          description: "",
          amount: 0,
          date: trip.start_date || "",
        },
      ],
    });
  const update = (i, k, v) => {
    const e = [...trip.trip_expenses];
    e[i] = { ...e[i], [k]: v };
    setTrip({ ...trip, trip_expenses: e });
  };
  const save = async () => {
    setBusy(true);
    try {
      await saveTrip(trip, trip.user_id);
      toast.success("Budget saved");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page">
      <PageHeader
        eyebrow={trip.name}
        title="What will this journey cost?"
        description="Keep an eye on the practical details while you plan the experience."
        actions={
          <button onClick={save} disabled={busy} className="btn-primary">
            {busy ? "Saving..." : "Save budget"}
          </button>
        }
      />
      <TripNav id={tripId} />
      {limit > 0 && total > limit && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex gap-3">
          <AlertTriangle />
          You're above your planned budget by {money(total - limit)}.
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-4 mb-7">
        <div className="surface rounded-xl p-6 md:col-span-2 bg-forest text-white">
          <p className="text-white/60 text-sm">Estimated journey</p>
          <p className="text-5xl font-extrabold mt-2">{money(total)}</p>
          <p className="mt-4 text-white/65">
            Based on your planned experiences and expenses.
          </p>
        </div>
        <div className="surface rounded-xl p-6">
          <p className="text-sm text-black/45">Average per day</p>
          <p className="text-3xl font-extrabold mt-2">
            {money(total / tripDays(trip))}
          </p>
          {limit > 0 && (
            <p className="text-sm text-black/45 mt-5">
              {money(Math.max(0, limit - total))} remaining
            </p>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-6">
        <section className="surface rounded-xl p-6">
          <h2 className="text-xl font-bold">Cost breakdown</h2>
          {data.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={money} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 grid place-items-center text-black/40">
              No costs yet.
            </div>
          )}
          <div className="space-y-2">
            {data.map((d, i) => (
              <div key={d.category} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: colors[i % colors.length] }}
                />
                <span className="flex-1">{d.name}</span>
                <b>{money(d.value)}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="surface rounded-xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-bold">Other expenses</h2>
              <p className="text-sm text-black/45">
                Manual costs saved with this journey.
              </p>
            </div>
            <button onClick={add} className="btn-secondary h-10">
              <Plus size={16} />
              Add expense
            </button>
          </div>
          <div className="space-y-3">
            {trip.trip_expenses.map((e, i) => (
              <div
                className="border border-black/10 rounded-lg p-3 grid sm:grid-cols-[1fr_120px_120px_36px] gap-2"
                key={e.id}
              >
                <input
                  className="field h-9"
                  placeholder="Expense name"
                  value={e.description || ""}
                  onChange={(x) => update(i, "description", x.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  className="field h-9"
                  value={e.amount || 0}
                  onChange={(x) => update(i, "amount", Number(x.target.value))}
                />
                <select
                  className="field h-9 capitalize"
                  value={e.category}
                  onChange={(x) => update(i, "category", x.target.value)}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    setTrip({
                      ...trip,
                      trip_expenses: trip.trip_expenses.filter(
                        (_, n) => n !== i,
                      ),
                    })
                  }
                  className="text-red-500"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
            {!trip.trip_expenses.length && (
              <p className="text-black/40 py-12 text-center">
                No additional expenses yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
