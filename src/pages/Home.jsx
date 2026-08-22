import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  WalletCards,
  ChevronLeft,
  ChevronRight,
  Globe2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CITY_SEED } from "../lib/constants";
import { ImageWithFallback, GlobeTrotterLogo, Footer } from "../components/UI";
const photos = {
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    hero_image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85",
  },
  kyoto: {
    name: "Kyoto",
    country: "Japan",
    hero_image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
  },
  bali: {
    name: "Bali",
    country: "Indonesia",
    hero_image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
  },
  paris: {
    name: "Paris",
    country: "France",
    hero_image: CITY_SEED[0].image_url,
  },
};
function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 bg-canvas/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-full flex items-center justify-between">
        <Link to="/">
          <GlobeTrotterLogo />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-muted">
          <a href="#discover">Destinations</a>
          <a href="#plan">Experiences</a>
          <a href="#story">How it works</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:inline text-sm font-bold">
            Log in
          </Link>
          <Link to="/signup" className="btn-primary h-10">
            Start planning <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
const heroImages = [
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2200&q=88",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=88",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=2200&q=88",
];
export default function Home() {
  const [hero, setHero] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setHero((x) => (x + 1) % heroImages.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-screen bg-canvas">
      <PublicHeader />
      <main>
        <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-8 pb-20">
          <div className="relative min-h-[620px] rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={heroImages[hero]}
              alt="A changing view from a memorable journey"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            />
            <div className="absolute right-6 bottom-6 z-20 flex items-center gap-2">
              <button
                onClick={() =>
                  setHero(
                    (x) => (x + heroImages.length - 1) % heroImages.length,
                  )
                }
                className="icon-btn bg-white/90"
              >
                <ChevronLeft size={17} />
              </button>
              <span className="px-3 py-2 rounded-lg bg-black/40 text-white text-xs font-bold">
                {hero + 1} / {heroImages.length}
              </span>
              <button
                onClick={() => setHero((x) => (x + 1) % heroImages.length)}
                className="icon-btn bg-white/90"
              >
                <ChevronRight size={17} />
              </button>
            </div>
            <div className="absolute right-8 top-8 z-20 size-24 sm:size-32 rounded-full border border-white/60 bg-black/20 backdrop-blur-sm text-white grid place-items-center animate-[spin_18s_linear_infinite]">
              <Globe2 size={54} strokeWidth={1} />
              <span className="absolute size-2 rounded-full bg-orange-300 -top-1 left-1/2" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
            <div className="relative z-10 max-w-2xl px-7 py-24 sm:px-14 sm:py-36 text-white">
              <p className="uppercase tracking-[.22em] text-xs font-bold text-orange-200">
                A digital travel journal
              </p>
              <h1 className="text-5xl sm:text-7xl font-extrabold leading-[.98] mt-5">
                There are places
                <br />
                you haven't met yet.
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mt-7 max-w-xl">
                GlobeTrotter turns the places you've been dreaming about into
                beautifully organized journeys, from the first destination you
                discover to the last experience you share.
              </p>
              <div className="flex flex-wrap gap-3 mt-9">
                <Link
                  to="/signup"
                  className="btn bg-white text-ink hover:bg-white/90"
                >
                  Start planning <ArrowRight size={17} />
                </Link>
                <a
                  href="#discover"
                  className="btn border border-white/30 text-white bg-white/10 hover:bg-white/20"
                >
                  Explore destinations
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id="story" className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-accent font-bold uppercase tracking-widest text-xs">
                The journey starts here
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold mt-3">
                One place can become an entire story.
              </h2>
            </div>
            <ArrowDown className="hidden sm:block text-accent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-12">
            {["Dream", "Discover", "Plan", "Experience", "Share"].map(
              (x, i) => (
                <div className="border-t-2 border-ink pt-4" key={x}>
                  <span className="text-accent text-sm font-bold">
                    0{i + 1}
                  </span>
                  <p className="text-xl font-bold mt-2">{x}</p>
                </div>
              ),
            )}
          </div>
        </section>
        <section id="discover" className="bg-white border-y border-border">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
            <p className="text-accent font-bold uppercase tracking-widest text-xs">
              Discover
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-3">
              Start somewhere you've never been.
            </h2>
            <p className="text-lg text-muted mt-4">
              Explore destinations and experiences before you ever create a
              trip.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {Object.entries(photos).map(([id, c], i) => (
                <Link
                  to={`/app/explore?city=${id}`}
                  key={id}
                  className={`group relative overflow-hidden ${i === 0 ? "h-80 sm:h-96" : "h-64 sm:h-80"} rounded-xl`}
                >
                  <ImageWithFallback
                    src={c.hero_image}
                    alt={`${c.name}, ${c.country}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <p className="text-xl font-bold">{c.name}</p>
                    <p className="text-sm text-white/70">{c.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section id="plan" className="max-w-7xl mx-auto px-5 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-bold uppercase tracking-widest text-xs">
                Plan
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold mt-3">
                Your trip shouldn't live in ten different tabs.
              </h2>
              <p className="text-lg text-muted mt-5">
                Build your route, organize your days, choose experiences and
                keep everything in one place.
              </p>
              <Link to="/app/trips/new" className="btn-primary mt-8">
                Build a journey <ArrowRight size={17} />
              </Link>
            </div>
            <div className="surface rounded-xl p-6 sm:p-8">
              <div className="border-b border-border pb-5">
                <p className="text-xs font-bold tracking-widest text-accent">
                  TOKYO Ãƒâ€šÃ‚Â· 12ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“14 JUN
                </p>
                {[
                  "09:00  Tokyo Tower",
                  "12:30  Tsukiji Food Tour",
                  "17:00  Shibuya Sky",
                ].map((x) => (
                  <p
                    className="py-3 border-b border-border last:border-0 font-semibold"
                    key={x}
                  >
                    {x}
                  </p>
                ))}
              </div>
              <div className="py-5 border-b border-border">
                <p className="text-xs font-bold tracking-widest text-accent">
                  KYOTO Ãƒâ€šÃ‚Â· 15ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“16 JUN
                </p>
                {["09:00  Fushimi Inari", "13:00  Arashiyama"].map((x) => (
                  <p
                    className="py-3 border-b border-border last:border-0 font-semibold"
                    key={x}
                  >
                    {x}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="bg-forest text-white">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sand font-bold uppercase tracking-widest text-xs">
                Experience
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold mt-3">
                Plan the details. Leave room for the unexpected.
              </h2>
              <p className="text-white/70 text-lg mt-5">
                GlobeTrotter keeps the practical details organized so the
                journey itself can stay spontaneous.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <ImageWithFallback
                src={photos.tokyo.hero_image}
                alt="Tokyo at night"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 bg-white text-ink rounded-lg p-5 shadow-soft">
                <p className="text-xs font-bold tracking-widest text-accent">
                  TOKYO
                </p>
                <p className="font-bold mt-2">3 experiences Ãƒâ€šÃ‚Â· 2 days</p>
                <p className="text-sm text-muted mt-1">
                  ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹18,400 estimated
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-5 lg:px-8 py-24 grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-accent font-bold uppercase tracking-widest text-xs">
              Budget
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold mt-3">
              Know what the journey will cost.
            </h2>
            <p className="text-lg text-muted mt-5">
              Make confident decisions while keeping the moments that matter.
            </p>
          </div>
          <div className="surface rounded-xl p-7">
            <div className="flex justify-between border-b border-border pb-5">
              <div>
                <p className="text-xs font-bold tracking-widest text-accent">
                  JAPAN Ãƒâ€šÃ‚Â· 7 DAYS
                </p>
                <p className="text-3xl font-extrabold mt-2">
                  ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹82,400
                </p>
                <p className="text-sm text-muted">Estimated trip cost</p>
              </div>
              <span className="chip bg-green-50 text-forest h-fit">
                <Check size={14} />
                Within budget
              </span>
            </div>
            {[
              ["Activities", "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹12,400"],
              ["Transport", "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹17,000"],
              ["Stay", "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹38,000"],
              ["Food", "ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹15,000"],
            ].map(([x, v]) => (
              <div
                className="flex justify-between py-4 border-b border-border last:border-0"
                key={x}
              >
                <span>{x}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-accent-soft">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-bold uppercase tracking-widest text-xs">
                Share
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold mt-3">
                Some journeys are better when they're shared.
              </h2>
              <p className="text-lg text-muted mt-5">
                Turn your itinerary into something worth sending to the people
                you're traveling with.
              </p>
            </div>
            <div className="bg-white rounded-xl p-7 shadow-soft">
              <p className="text-xs font-bold tracking-widest text-accent">
                JAPAN Ãƒâ€šÃ‚Â· BEYOND THE ORDINARY
              </p>
              <p className="text-2xl font-extrabold mt-3">
                Tokyo Ãƒâ€šÃ‚Â· Kyoto Ãƒâ€šÃ‚Â· Osaka
              </p>
              <p className="text-muted mt-2">
                7 days Ãƒâ€šÃ‚Â· 12 JUN ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â 19 JUN
              </p>
              <Link to="/signup" className="btn-primary mt-7">
                View journey <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="relative min-h-[430px] overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=2200&q=88"
            alt="Mountain lake at golden hour"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-28 text-center text-white">
            <h2 className="text-4xl sm:text-6xl font-extrabold">
              Your next story is somewhere out there.
            </h2>
            <p className="text-lg text-white/80 mt-5">
              All you need is a place to begin.
            </p>
            <Link to="/signup" className="btn bg-white text-ink mt-8">
              Start planning <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
