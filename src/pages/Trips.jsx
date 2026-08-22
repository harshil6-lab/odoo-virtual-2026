import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { listTrips, deleteTrip } from "../lib/store";
import {
  PageHeader,
  TripCard,
  Loading,
  Empty,
  ErrorBox,
} from "../components/UI";
export default function Trips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState(null),
    [q, setQ] = useState(""),
    [error, setError] = useState("");
  const load = () =>
    listTrips(user.id)
      .then(setTrips)
      .catch((e) => setError(e.message));
  useEffect(load, [user.id]);
  const remove = async (id) => {
    if (!confirm("Delete this trip and its itinerary?")) return;
    await deleteTrip(id);
    toast.success("Trip deleted");
    load();
  };
  if (error)
    return (
      <div className="page">
        <ErrorBox message={error} />
      </div>
    );
  if (!trips) return <Loading />;
  const shown = trips.filter((t) =>
    t.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="page">
      <PageHeader
        eyebrow="Your journeys"
        title="My trips"
        description="Every plan, booking, and memorable moment in one place."
        actions={
          <Link className="btn-primary" to="/app/trips/new">
            <Plus size={18} />
            New trip
          </Link>
        }
      />
      {trips.length > 0 && (
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3.5 top-3 text-black/35" size={18} />
          <input
            className="field pl-10"
            placeholder="Search your trips"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      )}
      {!trips.length ? (
        <Empty />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map((t) => (
            <TripCard key={t.id} trip={t} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
