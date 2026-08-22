import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { listTrips } from "../lib/store";
import { CITY_SEED } from "../lib/constants";
import { PageHeader, TripCard, Loading, SmartImage } from "../components/UI";
import { tripDays } from "../lib/utils";
export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState(null);
  useEffect(() => {
    listTrips(user?.id).then(setTrips);
  }, [user]);
  if (!trips) return <Loading />;
  const upcoming =
    trips.find((t) => t.start_date && new Date(t.start_date) >= new Date()) ||
    trips[0];
  return (
    <div className="page">
      <PageHeader
        eyebrow={`Good morning, ${user?.user_metadata?.name || user?.name || "traveler"}`}
        title="Where will you go next?"
        description="Your travel world, beautifully organized."
        actions={
          <Link className="btn-primary" to="/app/trips/new">
            <Plus size={18} />
            Plan a trip
          </Link>
        }
      />
      {upcoming ? (
        <section className="surface rounded-lg overflow-hidden mb-8 relative min-h-[280px]">
          <SmartImage
            src={upcoming.cover_image}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
          <div className="relative p-7 sm:p-10 text-white max-w-xl">
            <span className="chip bg-white/15 text-white">
              Your next adventure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4">
              {upcoming.name}
            </h2>
            <p className="text-white/75 mt-2">
              {upcoming.description || "A journey worth remembering."}
            </p>
            <Link
              to={`/app/trips/${upcoming.id}/itinerary`}
              className="btn mt-6 bg-white text-ink hover:bg-white/90"
            >
              Open itinerary <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      ) : (
        <div className="surface rounded-lg p-10 mb-8">
          <h2 className="text-2xl font-bold">Your next chapter starts here.</h2>
          <p className="text-black/55 mt-2">
            Build an itinerary that feels as good as the destination.
          </p>
          <Link className="btn-primary mt-5" to="/app/trips/new">
            <Plus size={18} />
            Create your first trip
          </Link>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          [MapPin, "Trips planned", trips.length],
          [
            CalendarDays,
            "Upcoming days",
            trips.reduce((n, t) => n + tripDays(t), 0),
          ],
          [
            TrendingUp,
            "Cities on your map",
            new Set(
              trips.flatMap((t) => (t.trip_stops || []).map((s) => s.city_id)),
            ).size,
          ],
          [
            ArrowUpRight,
            "Shared trips",
            trips.filter((t) => t.is_public).length,
          ],
        ].map(([I, l, v]) => (
          <div className="surface rounded-lg p-4 sm:p-5" key={l}>
            <I className="text-accent" size={19} />
            <p className="text-2xl font-extrabold mt-3">{v}</p>
            <p className="text-sm text-black/50 mt-1">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent trips</h2>
        <Link to="/app/trips" className="text-sm font-bold text-accent">
          View all
        </Link>
      </div>
      {trips.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.slice(0, 3).map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      ) : (
        <p className="text-black/50">Your trips will appear here.</p>
      )}
      <h2 className="text-xl font-bold mt-10 mb-4">
        Find your next destination
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CITY_SEED.slice(0, 5).map((c) => (
          <Link
            to={`/app/explore?city=${c.id}`}
            key={c.id}
            className="relative h-36 rounded-lg overflow-hidden group"
          >
            <SmartImage
              src={c.image_url}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white font-bold">
              {c.name}
              <span className="block text-xs font-normal text-white/70">
                {c.country}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
