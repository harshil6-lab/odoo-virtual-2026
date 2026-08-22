import {
  AlertCircle,
  ArrowRight,
  LoaderCircle,
  MapPin,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FALLBACK_IMAGE } from "../lib/constants";
import { dateRange } from "../lib/utils";
export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
      <div>
        {eyebrow && (
          <p className="text-accent text-sm font-bold uppercase tracking-wider mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl lg:text-4xl font-extrabold">{title}</h1>
        {description && (
          <p className="text-black/55 mt-2 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
export function Loading() {
  return (
    <div className="py-24 grid place-items-center text-black/50">
      <LoaderCircle className="animate-spin mb-3" />
      <p>Getting everything ready…</p>
    </div>
  );
}
export function Empty({
  title = "Nothing here yet",
  text = "Start planning your next memorable journey.",
  to = "/app/trips/new",
}) {
  return (
    <div className="surface rounded-lg py-20 px-6 text-center">
      <div className="size-12 rounded-full bg-orange-50 text-accent grid place-items-center mx-auto mb-4">
        <MapPin />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-black/50 mt-2 mb-5">{text}</p>
      <Link className="btn-primary" to={to}>
        <Plus size={18} />
        Plan a trip
      </Link>
    </div>
  );
}
export function ErrorBox({ message }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 flex gap-3">
      <AlertCircle />
      {message}
    </div>
  );
}
export function SmartImage({
  src,
  className = "",
  alt = "",
  loading = "lazy",
  ...props
}) {
  return (
    <img
      src={src || FALLBACK_IMAGE}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        e.currentTarget.src = FALLBACK_IMAGE;
      }}
      {...props}
    />
  );
}
export function GlobeTrotterLogo({ compact = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative size-9 shrink-0 rounded-xl bg-accent text-white grid place-items-center overflow-hidden">
        <span className="size-5 rounded-full border-2 border-white/90" />
        <span className="absolute w-7 h-px bg-white/80 rotate-[-35deg]" />
        <span className="absolute size-1.5 rounded-full bg-white top-2.5 right-2" />
      </span>
      {!compact && (
        <span className="font-extrabold tracking-tight">GlobeTrotter</span>
      )}
    </span>
  );
}
export function GlobeTrotterWordmark({ className = "" }) {
  return <GlobeTrotterLogo className={className} />;
}
export function ImageWithFallback({ src, className = "", alt = "", ...props }) {
  return <SmartImage src={src} className={className} alt={alt} {...props} />;
}
export function Footer() {
  return (
    <footer className="bg-forest text-white mt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <GlobeTrotterLogo className="text-white" />
          <p className="text-white/65 mt-4 max-w-xs">
            Turn places into plans, and plans into memories.
          </p>
          <p className="text-white/45 text-sm mt-8">
            Made for people who'd rather collect memories than things.
          </p>
        </div>
        {[
          ["Explore", [["Destinations", "/app/explore"], ["Experiences", "/app/explore"], ["Community", "/app/community"]]],
          ["Plan", [["My journeys", "/app/trips"], ["Calendar", "/app/dashboard"]]],
          ["Account", [["Sign in", "/login"], ["Register", "/register"]]],
        ].map(([title, items]) => (
          <div key={title}>
            <p className="text-sm font-bold text-sand uppercase tracking-wider">
              {title}
            </p>
            <div className="mt-4 space-y-3 text-sm text-white/65">
              {items.map(([label, to]) => (
                <Link key={label} to={to} className="block text-white/65 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-7 text-sm text-white/40">
        © 2026 GlobeTrotter
      </div>
    </footer>
  );
}
export function TripCard({ trip, onDelete }) {
  const stops = trip.trip_stops || [];
  const count = stops.reduce((n, s) => n + (s.trip_activities?.length || 0), 0);
  return (
    <article className="surface rounded-lg overflow-hidden group">
      <div className="relative h-52 overflow-hidden">
        <SmartImage
          src={trip.cover_image}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
        />
        <span
          className={`absolute top-3 right-3 chip ${trip.is_public ? "bg-emerald-500 text-white" : "bg-white/90"}`}
        >
          {trip.is_public ? "Public" : "Private"}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-bold text-accent uppercase">
          {dateRange(trip.start_date, trip.end_date)}
        </p>
        <h3 className="text-xl font-bold mt-1">{trip.name}</h3>
        <p className="text-sm text-black/50 mt-2">
          {stops.length} cities · {count} activities
        </p>
        <div className="mt-5 flex gap-2">
          <Link
            to={`/app/trips/${trip.id}`}
            className="btn-secondary flex-1 h-10"
          >
            View trip <ArrowRight size={16} />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(trip.id)}
              className="px-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
