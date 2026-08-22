import { CITY_SEED, ACTIVITY_SEED } from "./constants";
import { uid } from "./utils";
import { supabase, isSupabaseConfigured } from "./supabase";
const key = "gt_trips";
const read = () => JSON.parse(localStorage.getItem(key) || "[]");
const write = (x) => localStorage.setItem(key, JSON.stringify(x));
const select =
  "*,trip_stops(*,city:cities(*),trip_activities(*,activity:activities(*))),trip_expenses(*)";
export async function listTrips(userId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("trips")
      .select(select)
      .eq("user_id", userId)
      .order("start_date");
    if (error) throw error;
    return data || [];
  }
  return read();
}
export async function getTrip(id) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("trips")
      .select(select)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }
  return read().find((t) => t.id === id);
}
export async function getPublicTrip(id) {
  if (isSupabaseConfigured) {
    const publicSelect =
      "id,name,description,start_date,end_date,cover_image,budget,is_public,trip_stops(id,city_id,start_date,end_date,position,city:cities(*),trip_activities(id,activity_id,scheduled_date,scheduled_time,custom_cost,activity:activities(*)))";
    const { data, error } = await supabase
      .from("trips")
      .select(publicSelect)
      .eq("id", id)
      .eq("is_public", true)
      .single();
    if (error) throw error;
    return data;
  }
  const trip = read().find((t) => t.id === id && t.is_public);
  if (!trip) return null;
  const { trip_expenses, ...safe } = trip;
  return safe;
}
export async function saveTrip(trip, userId) {
  const now = new Date().toISOString(),
    id = trip.id || uid();
  let ownerId = userId || "demo-user";
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    ownerId = data.session?.user?.id;
    if (!ownerId)
      throw new Error("Your session has expired. Please log in again.");
  }
  const payload = {
    id,
    user_id: ownerId,
    name: trip.name,
    description: trip.description || null,
    start_date: trip.start_date,
    end_date: trip.end_date,
    cover_image: trip.cover_image || null,
    budget: Number(trip.budget) || 0,
    is_public: Boolean(trip.is_public),
    updated_at: now,
  };
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("trips")
      .upsert(payload)
      .select()
      .single();
    if (error) throw error;
    const stops = trip.trip_stops || [];
    if (stops.length) {
      const { error: e } = await supabase.from("trip_stops").upsert(
        stops.map((s, i) => ({
          id: s.id,
          trip_id: id,
          city_id: s.city_id,
          start_date: s.start_date || null,
          end_date: s.end_date || null,
          position: i,
        })),
      );
      if (e) throw e;
    }
    const keepStops = stops.map((s) => s.id);
    let stale = supabase.from("trip_stops").delete().eq("trip_id", id);
    if (keepStops.length) stale = stale.not("id", "in", keepStops);
    const { error: staleError } = await stale;
    if (staleError) throw staleError;
    for (const s of stops) {
      const acts = s.trip_activities || [];
      if (acts.length) {
        const { error: e } = await supabase.from("trip_activities").upsert(
          acts.map((a) => ({
            id: a.id,
            trip_stop_id: s.id,
            activity_id: a.activity_id,
            scheduled_date: a.scheduled_date || null,
            scheduled_time: a.scheduled_time || null,
            custom_cost: Number(a.custom_cost ?? a.activity?.cost ?? 0),
            notes: a.notes || null,
          })),
        );
        if (e) throw e;
      }
      const ids = acts.map((a) => a.id);
      let del = supabase
        .from("trip_activities")
        .delete()
        .eq("trip_stop_id", s.id);
      if (ids.length) del = del.not("id", "in", ids);
      const { error: deleteActivityError } = await del;
      if (deleteActivityError) throw deleteActivityError;
    }
    const expenses = trip.trip_expenses || [];
    if (expenses.length) {
      const { error: e } = await supabase.from("trip_expenses").upsert(
        expenses.map((e) => ({
          id: e.id,
          trip_id: id,
          category: e.category,
          description: e.description || "",
          amount: Number(e.amount) || 0,
          date: e.date || null,
        })),
      );
      if (e) throw e;
    }
    const expIds = expenses.map((e) => e.id);
    let expDel = supabase.from("trip_expenses").delete().eq("trip_id", id);
    if (expIds.length) expDel = expDel.not("id", "in", expIds);
    const { error: deleteExpenseError } = await expDel;
    if (deleteExpenseError) throw deleteExpenseError;
    return { ...data, trip_stops: stops, trip_expenses: expenses };
  }
  const full = { ...trip, ...payload, created_at: trip.created_at || now };
  const all = read();
  const i = all.findIndex((x) => x.id === id);
  if (i >= 0) all[i] = full;
  else all.unshift(full);
  write(all);
  return full;
}
export async function deleteTrip(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  write(read().filter((t) => t.id !== id));
}
export async function getCities() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("popularity", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  return CITY_SEED;
}
export async function getActivities() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("activities")
      .select("*,city:cities(*)")
      .order("name");
    if (error) throw error;
    return data || [];
  }
  return ACTIVITY_SEED.map((a) => ({
    ...a,
    city: CITY_SEED.find((c) => c.id === a.city_id),
  }));
}
export async function getCity(id) {
  const cities = await getCities();
  return cities.find((c) => c.id === id) || null;
}
export async function getActivity(id) {
  const activities = await getActivities();
  return activities.find((a) => a.id === id) || null;
}
export async function addActivityToStop(trip, stopId, activity, userId) {
  const duplicate = (trip.trip_stops || []).some((s) =>
    (s.trip_activities || []).some((a) => a.activity_id === activity.id),
  );
  if (duplicate) throw new Error("This experience is already in that journey.");
  const updated = {
    ...trip,
    trip_stops: (trip.trip_stops || []).map((s) =>
      s.id === stopId
        ? {
            ...s,
            trip_activities: [
              ...(s.trip_activities || []),
              {
                id: uid(),
                activity_id: activity.id,
                activity,
                custom_cost: activity.cost,
                scheduled_date: null,
                scheduled_time: null,
                notes: null,
              },
            ],
          }
        : s,
    ),
  };
  return saveTrip(updated, userId);
}
