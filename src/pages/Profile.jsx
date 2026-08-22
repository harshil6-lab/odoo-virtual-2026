import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, KeyRound, LogOut, Save } from "lucide-react";
import { useAuth } from "../lib/auth";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { listTrips } from "../lib/store";
import { toast } from "sonner";
import { ImageWithFallback, Loading } from "../components/UI";
import { getInitials } from "../lib/utils";
export default function Profile() {
  const { user, logout } = useAuth(),
    nav = useNavigate(),
    [profile, setProfile] = useState(null),
    [trips, setTrips] = useState([]),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([
      isSupabaseConfigured
        ? supabase
            .from("profiles")
            .select("name,avatar_url,language")
            .eq("id", user.id)
            .single()
            .then(({ data, error }) => {
              if (error) throw error;
              return data;
            })
        : Promise.resolve(
            JSON.parse(localStorage.getItem("gt_profile") || "null") || {
              name: user.name || user.email?.split("@")[0],
              avatar_url: "",
              language: "English",
            },
          ),
      listTrips(user.id),
    ])
      .then(([p, t]) => {
        const bits = (p.name || "").trim().split(/\s+/);
        setProfile({
          ...p,
          first: bits[0] || "",
          last: bits.slice(1).join(" "),
        });
        setTrips(t);
      })
      .catch((e) => toast.error("We couldn't load your profile."));
  }, [user.id]);
  const stats = useMemo(
    () => ({
      journeys: trips.length,
      cities: new Set(
        trips.flatMap((t) => (t.trip_stops || []).map((s) => s.city_id)),
      ).size,
      experiences: trips.reduce(
        (n, t) =>
          n +
          (t.trip_stops || []).reduce(
            (m, s) => m + (s.trip_activities?.length || 0),
            0,
          ),
        0,
      ),
    }),
    [trips],
  );
  if (!profile) return <Loading />;
  const update = (k, v) => setProfile({ ...profile, [k]: v });
  const save = async () => {
    setBusy(true);
    const payload = {
      name: `${profile.first} ${profile.last}`.trim(),
      language: profile.language,
      avatar_url: profile.avatar_url || null,
      updated_at: new Date().toISOString(),
    };
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", user.id);
        if (error) throw error;
        await supabase.auth.updateUser({ data: { name: payload.name } });
      } else {
        localStorage.setItem("gt_profile", JSON.stringify(payload));
        localStorage.setItem(
          "gt_user",
          JSON.stringify({ ...user, name: payload.name }),
        );
      }
      toast.success("Changes saved.");
    } catch (e) {
      toast.error("We couldn't save your changes.");
    } finally {
      setBusy(false);
    }
  };
  const resetPassword = async () => {
    if (!isSupabaseConfigured)
      return toast.error("Password reset requires Supabase configuration.");
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${location.origin}/login`,
    });
    error
      ? toast.error("Unable to send the reset email.")
      : toast.success("Password reset email sent.");
  };
  const signOut = async () => {
    if (
      !confirm("Leave GlobeTrotter?\n\nYou'll be signed out of this account.")
    )
      return;
    await logout();
    nav("/", { replace: true });
  };
  return (
    <div className="page max-w-6xl">
      <header className="py-8 lg:py-12 max-w-3xl">
        <p className="text-accent text-sm font-bold tracking-widest">
          MY TRAVEL IDENTITY
        </p>
        <h1 className="text-4xl lg:text-6xl font-extrabold mt-3">
          Your profile
        </h1>
        <p className="text-lg text-black/55 mt-4">
          Tell GlobeTrotter a little about the traveler behind the journeys.
        </p>
      </header>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-7">
        <main className="surface rounded-xl p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-7 border-b border-black/10">
            <div className="size-24 rounded-full overflow-hidden bg-ink text-white grid place-items-center text-2xl font-bold shrink-0">
              {profile.avatar_url ? (
                <ImageWithFallback
                  src={profile.avatar_url}
                  alt={`${profile.first} ${profile.last}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(`${profile.first} ${profile.last}` || user.email)
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {`${profile.first} ${profile.last}`.trim() || "Traveler"}
              </h2>
              <p className="text-black/45">{user.email}</p>
            </div>
          </div>
          <section className="mt-7">
            <h2 className="text-2xl font-bold">Personal information</h2>
            <div className="grid sm:grid-cols-2 gap-5 mt-5">
              <label>
                <span className="label">First name</span>
                <input
                  className="field"
                  value={profile.first}
                  onChange={(e) => update("first", e.target.value)}
                />
              </label>
              <label>
                <span className="label">Last name</span>
                <input
                  className="field"
                  value={profile.last}
                  onChange={(e) => update("last", e.target.value)}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="label">Email</span>
                <input
                  disabled
                  className="field bg-black/[.03]"
                  value={user.email || ""}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="label">Avatar image URL</span>
                <input
                  className="field"
                  value={profile.avatar_url || ""}
                  onChange={(e) => update("avatar_url", e.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label>
                <span className="label">Language</span>
                <select
                  className="field"
                  value={profile.language || "English"}
                  onChange={(e) => update("language", e.target.value)}
                >
                  <option>English</option>
                  <option>Japanese</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </label>
            </div>
            <button disabled={busy} onClick={save} className="btn-primary mt-7">
              <Save size={17} />
              {busy ? "Saving..." : "Save changes"}
            </button>
          </section>
          <section className="mt-10 pt-8 border-t border-black/10">
            <h2 className="text-2xl font-bold">Account security</h2>
            <p className="text-black/50 mt-2">
              Password changes are handled securely through your account email.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button onClick={resetPassword} className="btn-secondary">
                <KeyRound size={17} />
                Reset password
              </button>
              <button onClick={signOut} className="btn-secondary text-red-600">
                <LogOut size={17} />
                Log out
              </button>
            </div>
          </section>
        </main>
        <aside className="space-y-5">
          <div className="surface rounded-xl p-6">
            <p className="text-xs font-bold tracking-widest text-accent">
              YOUR JOURNEYS
            </p>
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              <span>
                <b className="text-3xl block">{stats.journeys}</b>
                <small>journeys</small>
              </span>
              <span>
                <b className="text-3xl block">{stats.cities}</b>
                <small>cities</small>
              </span>
              <span>
                <b className="text-3xl block">{stats.experiences}</b>
                <small>experiences</small>
              </span>
            </div>
            <Link to="/app/trips" className="btn-primary w-full mt-7">
              View my journeys <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative rounded-xl overflow-hidden min-h-64">
            <ImageWithFallback
              src={trips[0]?.cover_image}
              alt="A memorable journey"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <p className="relative text-white p-6 text-2xl font-bold">
              Every journey leaves a mark.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
