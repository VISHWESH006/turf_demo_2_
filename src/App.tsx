import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Send,
  ShieldCheck,
  Ticket,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

type Booking = {
  id: string;
  name: string;
  phone: string;
  location: string;
  date: string;
  time: string;
  players: string;
  createdAt: string;
};

type RevealProps = { children: ReactNode; className?: string; delay?: number };

const queryClient = new QueryClient();
const timeSlots = ['7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];
const defaultSlotBookings: Record<string, string> = {
  '7:00 PM': 'Arjun & Co.',
  '9:00 PM': 'Midnight FC',
};
const locations = [
  { name: 'TURF. Rooftop', sub: '5th Floor · 12th Main, Indiranagar', note: 'The only pitch above street level', image: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1000' },
];

function readSlotBookings(): Record<string, string> {
  try {
    const value = localStorage.getItem('turf-slot-bookings');
    return value ? { ...defaultSlotBookings, ...JSON.parse(value) as Record<string, string> } : defaultSlotBookings;
  } catch {
    return defaultSlotBookings;
  }
}

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${visible ? 'reveal' : 'opacity-0'} ${className}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
}

function readBooking(): Booking | null {
  try {
    const value = localStorage.getItem('turf-booking');
    return value ? JSON.parse(value) as Booking : null;
  } catch { return null; }
}

function Header({ onBook }: { onBook: () => void }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'The venue' },
    { href: '/bookings', label: 'My booking' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-8">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between rounded-full border border-white/15 bg-[#16233a]/90 px-4 py-3 text-[#f5f0e5] shadow-lg backdrop-blur-md sm:px-6">
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2" data-testid="link-logo">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#00d5ac] text-[#16233a]"><CircleDot size={18} strokeWidth={3} /></span>
          <span className="font-display text-lg font-bold tracking-[-.04em]">TURF<span className="text-[#00d5ac]">.</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[.14em] transition-colors ${location === item.href ? 'bg-white/12 text-[#00d5ac]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-white/50">Bengaluru · 06:42 PM</span>
          <button onClick={onBook} data-testid="button-header-book" className="group flex items-center gap-2 rounded-full bg-[#f27a4b] px-4 py-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#16233a] transition-transform hover:-translate-y-0.5">
            Book a slot <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu" data-testid="button-mobile-menu">
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {menuOpen && (
        <div className="mx-1 mt-2 rounded-3xl border border-white/15 bg-[#16233a] p-3 shadow-xl md:hidden">
          {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"><span>{item.label}</span><ChevronRight size={16} /></Link>)}
          <button onClick={() => { setMenuOpen(false); onBook(); }} data-testid="button-mobile-book" className="mt-2 flex w-full items-center justify-between rounded-2xl bg-[#f27a4b] px-4 py-3 text-sm font-bold text-[#16233a]">Book a slot <ArrowUpRight size={16} /></button>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#16233a] px-5 pb-8 pt-16 text-[#f5f0e5] sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-10 border-b border-white/12 pb-12 md:grid-cols-[1.4fr_.7fr_.7fr_.8fr]">
          <div>
            <p className="font-display text-5xl font-bold leading-[.88] tracking-[-.08em] sm:text-7xl">SEE YOU<br /><span className="text-[#00d5ac]">UNDER LIGHTS.</span></p>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/55">The last-minute game is usually the one you remember. Bengaluru, your pitch is waiting.</p>
          </div>
          <div><p className="font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#00d5ac]">Explore</p><div className="mt-4 grid gap-3 text-sm text-white/65"><Link href="/" className="hover:text-white">Home</Link><Link href="/about" className="hover:text-white">The venue</Link><Link href="/bookings" className="hover:text-white">My booking</Link></div></div>
          <div><p className="font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#00d5ac]">Find us</p><div className="mt-4 grid gap-3 text-sm text-white/65"><a href="https://maps.google.com/?q=12th+Main+Indiranagar+Bengaluru" target="_blank" rel="noreferrer" className="hover:text-white">5th floor · 12th Main</a><span>Indiranagar · East Bengaluru</span></div></div>
          <div><p className="font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#00d5ac]">Say hello</p><div className="mt-4 grid gap-3 text-sm text-white/65"><a href="tel:+918045555555" className="flex items-center gap-2 hover:text-white"><Phone size={14} /> +91 80 4555 5555</a><Link href="/contact" className="flex items-center gap-2 hover:text-white"><Mail size={14} /> Write to the team</Link><a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white"><Instagram size={14} /> @turf.play</a></div></div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] uppercase tracking-[.15em] text-white/35 sm:flex-row"><span>© 2025 TURF / Bengaluru</span><span>Built for the rush, not the routine.</span></div>
      </div>
    </footer>
  );
}

function BookingModal({ onClose, onSaved, initialTime = '8:00 PM', slotBookings, onSlotBooked }: { onClose: () => void; onSaved: (booking: Booking) => void; initialTime?: string; slotBookings: Record<string, string>; onSlotBooked: (time: string, name: string) => void }) {
  const [form, setForm] = useState({ name: '', phone: '', location: 'TURF. Rooftop', date: '', time: initialTime, players: '10 players' });
  const [submitted, setSubmitted] = useState(false);
  const [slotError, setSlotError] = useState('');
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (slotBookings[form.time]) {
      setSlotError('That slot just filled. Choose another time.');
      return;
    }
    const booking: Booking = { ...form, id: `T-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString() };
    localStorage.setItem('turf-booking', JSON.stringify(booking));
    onSlotBooked(form.time, form.name);
    setSubmitted(true);
    onSaved(booking);
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-[#101b2ccc] p-0 backdrop-blur-sm sm:place-items-center sm:p-5" role="dialog" aria-modal="true">
      <div className="max-h-[94dvh] w-full overflow-y-auto rounded-t-[2rem] bg-[#f5f0e5] p-6 text-[#16233a] shadow-2xl sm:max-w-[540px] sm:rounded-[2rem] sm:p-8">
        <div className="flex items-start justify-between"><div><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#f27a4b]">Last-minute plans</p><h2 className="mt-2 font-display text-4xl font-bold tracking-[-.06em]">{submitted ? 'You are in.' : 'Book the night.'}</h2></div><button onClick={onClose} aria-label="Close booking form" data-testid="button-close-booking" className="grid h-9 w-9 place-items-center rounded-full bg-[#16233a]/8 hover:bg-[#16233a]/15"><X size={18} /></button></div>
        {submitted ? (
          <div className="py-12 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#00d5ac] text-[#16233a]"><Check size={30} strokeWidth={3} /></div><p className="mt-6 font-display text-2xl font-bold">Pitch locked for {form.date || 'your chosen night'}.</p><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#16233a]/60">Your confirmation is saved on this device. Bring the team, or just bring the energy.</p><button onClick={onClose} data-testid="button-done-booking" className="mt-8 rounded-full bg-[#16233a] px-6 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#f5f0e5]">Done</button></div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-5">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">Your name<input required value={form.name} onChange={(e) => update('name', e.target.value)} data-testid="input-booking-name" placeholder="The captain" className="field" /></label>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">WhatsApp number<input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} data-testid="input-booking-phone" placeholder="+91 98765 43210" className="field" /></label>
             <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">Venue<input value={form.location} readOnly data-testid="input-booking-location" className="field" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">When<input required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} data-testid="input-booking-date" className="field" /></label></div>
             <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">Kick-off<select value={form.time} onChange={(e) => { update('time', e.target.value); setSlotError(''); }} data-testid="select-booking-time" className="field">{timeSlots.map((time) => <option key={time} value={time} disabled={Boolean(slotBookings[time])}>{time}{slotBookings[time] ? ` · Booked by ${slotBookings[time]}` : ' · Available'}</option>)}</select></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">Squad size<select value={form.players} onChange={(e) => update('players', e.target.value)} data-testid="select-booking-players" className="field">{['8 players', '10 players', '12 players', '14 players'].map((players) => <option key={players}>{players}</option>)}</select></label></div>
             {slotError && <p role="alert" className="text-xs font-bold text-[#d9542a]">{slotError}</p>}
            <button type="submit" data-testid="button-submit-booking" className="group mt-2 flex items-center justify-between rounded-xl bg-[#f27a4b] px-5 py-4 text-xs font-bold uppercase tracking-[.15em] text-[#16233a] transition-transform hover:-translate-y-0.5">Lock this pitch <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button>
            <p className="flex items-center justify-center gap-2 text-center text-[11px] text-[#16233a]/45"><ShieldCheck size={13} /> No payment now. This is a demo booking.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function SlotBoard({ slotBookings, onBook }: { slotBookings: Record<string, string>; onBook: (time?: string) => void }) {
  return (
    <section className="overflow-hidden bg-[#e1e8e1] px-5 py-20 text-[#16233a] sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <Reveal>
          <p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#f27a4b]">Tonight · live slot board</p>
          <h2 className="mt-5 max-w-sm font-display text-5xl font-bold leading-[.88] tracking-[-.08em] sm:text-7xl">ONE PITCH.<br /><span className="text-[#00a887]">YOUR MOVE.</span></h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-[#16233a]/60">The rooftop runs one game at a time. See what other squads have locked, then grab the next open window.</p>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {timeSlots.map((time, index) => {
            const bookedBy = slotBookings[time];
            return (
              <Reveal key={time} delay={index * 90}>
                <button type="button" disabled={Boolean(bookedBy)} onClick={() => onBook(time)} aria-label={bookedBy ? `${time} booked by ${bookedBy}` : `Book the ${time} slot`} className={`group flex w-full items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300 ${bookedBy ? 'cursor-not-allowed border-[#16233a]/10 bg-[#f5f0e5]/60 opacity-65' : 'border-[#16233a]/15 bg-[#f5f0e5] hover:-translate-y-1 hover:border-[#00a887] hover:shadow-lg'}`}>
                  <span>
                    <span className={`font-mono-custom text-[10px] uppercase tracking-[.16em] ${bookedBy ? 'text-[#f27a4b]' : 'text-[#00a887]'}`}>{bookedBy ? 'Booked' : 'Open now'}</span>
                    <span className="mt-2 block font-display text-2xl font-bold">{time}</span>
                    <span className="mt-1 block text-xs text-[#16233a]/55">{bookedBy ? `By ${bookedBy}` : 'Tap to lock this slot'}</span>
                  </span>
                  <span className={`grid h-10 w-10 place-items-center rounded-full border transition-all ${bookedBy ? 'border-[#16233a]/10' : 'border-[#16233a]/15 group-hover:bg-[#f27a4b] group-hover:text-[#16233a]'}`}><ArrowUpRight size={16} /></span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Home({ onBook, slotBookings }: { onBook: (time?: string) => void; slotBookings: Record<string, string> }) {
  return (
    <main>
      <section className="relative min-h-[760px] overflow-hidden bg-[#16233a] px-5 pb-20 pt-36 text-[#f5f0e5] sm:min-h-[820px] sm:px-8 sm:pt-48">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(90deg, rgba(22,35,58,.98) 0%, rgba(22,35,58,.78) 38%, rgba(22,35,58,.12) 100%), url('https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1800')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute -right-20 top-36 h-72 w-72 rounded-full border border-[#00d5ac]/40 sm:h-[30rem] sm:w-[30rem]" /><div className="absolute -right-8 top-48 h-56 w-56 rounded-full border border-[#f27a4b]/35 sm:h-[24rem] sm:w-[24rem]" />
        <div className="relative mx-auto max-w-[1320px]">
          <div className="max-w-3xl"><div className="reveal flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.22em] text-[#00d5ac]"><span className="h-px w-10 bg-[#00d5ac]" /> Bengaluru, after dark</div>
            <h1 className="reveal reveal-delay-1 mt-7 max-w-4xl font-display text-[clamp(4.3rem,12vw,10.5rem)] font-bold leading-[.78] tracking-[-.1em]">PLAY<br /><span className="text-[#00d5ac]">LOUD.</span></h1>
            <p className="reveal reveal-delay-2 mt-9 max-w-md text-base leading-7 text-white/65 sm:text-lg">The city clocks out. You clock in. Turf is the night-first football venue for games that start with “who’s free?”</p>
             <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={() => onBook()} data-testid="button-hero-book" className="group flex items-center justify-between gap-9 rounded-full bg-[#f27a4b] px-5 py-3.5 text-xs font-bold uppercase tracking-[.15em] text-[#16233a] transition-transform hover:-translate-y-1 sm:justify-start">Find a pitch <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button><Link href="/about" data-testid="link-hero-about" className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-xs font-bold uppercase tracking-[.15em] text-white transition-colors hover:bg-white/10">Why Turf <ChevronRight size={16} /></Link></div>
          </div>
          <div className="reveal reveal-delay-4 mt-20 flex items-end justify-between border-t border-white/15 pt-5 sm:mt-28"><div><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-white/40">Tonight's window</p><p className="mt-2 font-display text-2xl font-bold">07:00 — 11:00 PM</p></div><div className="hidden items-center gap-2 text-right sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-[#00d5ac]" /><span className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-white/55">Four time slots tonight</span></div><div className="text-right sm:hidden"><p className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#00d5ac]">Four slots tonight</p></div></div>
        </div>
       </section>
       <SlotBoard slotBookings={slotBookings} onBook={onBook} />
      <section className="bg-[#f5f0e5] px-5 py-20 text-[#16233a] sm:px-8 sm:py-28"><div className="mx-auto max-w-[1320px]"><Reveal className="grid gap-10 lg:grid-cols-[.9fr_1.5fr] lg:items-end"><div><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#f27a4b]">A different kind of home ground</p><h2 className="mt-5 max-w-sm font-display text-5xl font-bold leading-[.9] tracking-[-.08em] sm:text-7xl">NO<br />SPECTATORS<br /><span className="text-[#00a887]">HERE.</span></h2></div><div className="grid gap-6 sm:grid-cols-3"><div className="border-t border-[#16233a]/20 pt-4"><Zap size={20} className="text-[#f27a4b]" /><p className="mt-5 font-display text-xl font-bold">Turn up. Tune out.</p><p className="mt-2 text-sm leading-6 text-[#16233a]/60">Floodlights, fresh turf, and a playlist with no skips.</p></div><div className="border-t border-[#16233a]/20 pt-4"><Clock3 size={20} className="text-[#f27a4b]" /><p className="mt-5 font-display text-xl font-bold">Your time, your rules.</p><p className="mt-2 text-sm leading-6 text-[#16233a]/60">Slots that work around late workdays and early ambitions.</p></div><div className="border-t border-[#16233a]/20 pt-4"><Trophy size={20} className="text-[#f27a4b]" /><p className="mt-5 font-display text-xl font-bold">Every game counts.</p><p className="mt-2 text-sm leading-6 text-[#16233a]/60">Pro-grade surfaces for casual players with serious energy.</p></div></div></Reveal></div></section>
       <section className="overflow-hidden bg-[#e1e8e1] px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-[1320px]"><Reveal className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#00a887]">The only pitch above street level</p><h2 className="mt-4 font-display text-5xl font-bold leading-[.88] tracking-[-.08em] sm:text-7xl">PLAY THE<br /><span className="text-[#f27a4b]">ROOFTOP.</span></h2></div><Link href="/about" data-testid="link-home-locations" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#16233a] underline decoration-[#00a887] decoration-2 underline-offset-8">See the venue <ArrowUpRight size={16} /></Link></Reveal><div className="mt-12 grid gap-4">{locations.map((location, index) => <Reveal key={location.name} delay={index * 100}><Link href="/about" data-testid={`card-location-${location.name.toLowerCase()}`} className="group relative block min-h-[390px] overflow-hidden rounded-[1.5rem] bg-[#16233a]"><img src={location.image} alt={`${location.name} rooftop venue`} className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#16233a] via-[#16233a]/10 to-transparent" /><div className="relative flex h-full flex-col justify-between p-5 text-white"><div className="flex justify-end"><span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 transition-colors group-hover:bg-[#f27a4b] group-hover:text-[#16233a]"><ArrowUpRight size={17} /></span></div><div><p className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#00d5ac]">01 / {location.note}</p><h3 className="mt-2 font-display text-4xl font-bold tracking-[-.06em]">{location.name}</h3><p className="mt-1 text-xs text-white/60">{location.sub}</p></div></div></Link></Reveal>)}</div></div></section>
       <section className="relative overflow-hidden bg-[#f27a4b] px-5 py-24 text-[#16233a] sm:px-8 sm:py-32"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[32px] border-[#16233a]/10 sm:h-[34rem] sm:w-[34rem]" /><div className="relative mx-auto max-w-[1320px]"><Reveal><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#16233a]/60">The only plan you need tonight</p><h2 className="mt-6 max-w-4xl font-display text-[clamp(3.5rem,9vw,8rem)] font-bold leading-[.8] tracking-[-.1em]">TEXT THE<br />GROUP CHAT.</h2><div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center"><button onClick={() => onBook()} data-testid="button-cta-book" className="group flex w-fit items-center gap-6 rounded-full bg-[#16233a] px-6 py-4 text-xs font-bold uppercase tracking-[.15em] text-[#f5f0e5] transition-transform hover:-translate-y-1">Book your game <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button><span className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#16233a]/60">No overthinking required</span></div></Reveal></div></section>
    </main>
  );
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: ReactNode; copy: string }) {
  return <section className="bg-[#16233a] px-5 pb-20 pt-36 text-[#f5f0e5] sm:px-8 sm:pb-28 sm:pt-48"><div className="mx-auto max-w-[1320px]"><p className="reveal flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.22em] text-[#00d5ac]"><span className="h-px w-10 bg-[#00d5ac]" /> {eyebrow}</p><h1 className="reveal reveal-delay-1 mt-8 max-w-5xl font-display text-[clamp(3.8rem,10vw,9rem)] font-bold leading-[.8] tracking-[-.1em]">{title}</h1><p className="reveal reveal-delay-2 mt-9 max-w-lg text-base leading-7 text-white/60">{copy}</p></div></section>;
}

function About() {
  return (
    <main>
      <PageIntro eyebrow="The one and only Turf" title={<>NOT A CLUB.<br /><span className="text-[#00d5ac]">A SIGNAL.</span></>} copy="A rooftop five-a-side ground above the city, built for spontaneous games, long-overdue rematches, and the tiny ritual that makes a workday worth finishing." />
      <section className="bg-[#f5f0e5] px-5 py-20 text-[#16233a] sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1fr_1.2fr]">
          <Reveal><div className="sticky top-28"><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#f27a4b]">The people behind the floodlights</p><h2 className="mt-5 max-w-md font-display text-5xl font-bold leading-[.88] tracking-[-.08em] sm:text-7xl">BUILT BY<br /><span className="text-[#00a887]">PLAYERS.</span></h2></div></Reveal>
          <div className="space-y-12">
            <Reveal><p className="max-w-xl text-xl leading-9 text-[#16233a]/75 sm:text-2xl">Turf started with one late-night game above the city and a very specific question: why should finding a great pitch feel harder than finding a team?</p><div className="mt-10 grid grid-cols-2 gap-4 border-y border-[#16233a]/15 py-6 sm:grid-cols-3"><div><p className="font-display text-4xl font-bold">2019</p><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[#16233a]/50">First kickoff</p></div><div><p className="font-display text-4xl font-bold">5TH</p><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[#16233a]/50">Floor up</p></div><div><p className="font-display text-4xl font-bold">6:30</p><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[#16233a]/50">PM, every day</p></div></div></Reveal>
            <Reveal><img src="https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Football pitch under evening lights" className="h-[380px] w-full rounded-[1.5rem] object-cover sm:h-[520px]" /></Reveal>
            <Reveal><div className="grid gap-6 sm:grid-cols-2">{[['01', 'The surface', 'FIFA-quality artificial grass that stays quick after the monsoon turns everything else into a puddle.'], ['02', 'The light', 'Even, warm floodlights. No shadows. No excuses. Just see the pass and make it count.'], ['03', 'The extras', 'Changing rooms, cold water, bibs, balls and a sideline that actually feels like a sideline.'], ['04', 'The altitude', 'A top-floor view over Bengaluru. The city moves below while your game gets louder.']].map(([number, title, copy]) => <div key={number} className="border-t border-[#16233a]/20 pt-4"><p className="font-mono-custom text-[10px] text-[#f27a4b]">{number}</p><h3 className="mt-5 font-display text-2xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#16233a]/60">{copy}</p></div>)}</div></Reveal>
          </div>
        </div>
      </section>
      <section className="bg-[#e1e8e1] px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-[1320px]"><Reveal><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#00a887]">Where the lights are</p><h2 className="mt-4 font-display text-5xl font-bold leading-[.88] tracking-[-.08em] text-[#16233a] sm:text-7xl">ONE<br />ROOFTOP<br /><span className="text-[#f27a4b]">SHIFT.</span></h2></Reveal><div className="mt-12 grid gap-4">{locations.map((loc) => <Reveal key={loc.name}><article className="rounded-3xl bg-[#f5f0e5] p-6 text-[#16233a] sm:p-8"><div className="flex items-center justify-between"><MapPin size={20} className="text-[#f27a4b]" /><a href="https://maps.google.com/?q=12th+Main+Indiranagar+Bengaluru" target="_blank" rel="noreferrer" data-testid="link-map-rooftop" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.15em] hover:text-[#00a887]">Directions <ExternalLink size={13} /></a></div><h3 className="mt-16 font-display text-4xl font-bold tracking-[-.06em]">{loc.name}</h3><p className="mt-2 text-sm text-[#16233a]/55">{loc.sub}</p><p className="mt-6 max-w-lg border-t border-[#16233a]/15 pt-5 text-sm leading-6 text-[#16233a]/65">Take the lift to the top floor. Follow the floodlights. There is only one pitch, and it is waiting above 12th Main.</p></article></Reveal>)}</div></div></section>
    </main>
  );
}

function Bookings({ booking, onBook }: { booking: Booking | null; onBook: () => void }) {
  return <main><PageIntro eyebrow="Your night, saved" title={booking ? <>YOUR<br /><span className="text-[#00d5ac]">PITCH.</span></> : <>NOTHING<br /><span className="text-[#f27a4b]">BOOKED.</span></>} copy={booking ? 'Your next game is on the board. Rally the group chat and get here early.' : 'No plans yet. The best games usually start with one person making the first move.'} /><section className="min-h-[420px] bg-[#f5f0e5] px-5 py-16 text-[#16233a] sm:px-8 sm:py-24"><div className="mx-auto max-w-[1320px]">{booking ? <Reveal className="mx-auto max-w-3xl"><div className="overflow-hidden rounded-[1.5rem] border border-[#16233a]/15 bg-[#e1e8e1]"><div className="flex items-center justify-between bg-[#00d5ac] px-6 py-4 text-[#16233a]"><span className="font-mono-custom text-[10px] font-bold uppercase tracking-[.18em]">Confirmed · {booking.id}</span><Ticket size={20} /></div><div className="grid gap-8 p-6 sm:grid-cols-[1fr_auto] sm:p-9"><div><p className="font-mono-custom text-[10px] uppercase tracking-[.17em] text-[#16233a]/50">Playing at</p><h2 className="mt-2 font-display text-4xl font-bold tracking-[-.06em]">{booking.location}</h2><p className="mt-2 text-sm text-[#16233a]/60">Bengaluru · {booking.players}</p></div><div className="grid grid-cols-2 gap-7 sm:text-right"><div><p className="font-mono-custom text-[10px] uppercase tracking-[.17em] text-[#16233a]/50">Date</p><p className="mt-2 font-display text-xl font-bold">{booking.date || 'Tonight'}</p></div><div><p className="font-mono-custom text-[10px] uppercase tracking-[.17em] text-[#16233a]/50">Kick-off</p><p className="mt-2 font-display text-xl font-bold">{booking.time}</p></div></div></div><div className="flex flex-col justify-between gap-4 border-t border-[#16233a]/12 px-6 py-5 sm:flex-row sm:items-center sm:px-9"><p className="flex items-center gap-2 text-xs text-[#16233a]/60"><Check size={15} className="text-[#00a887]" /> Saved locally on this device</p><a href={`https://maps.google.com/?q=${booking.location}+Bengaluru`} target="_blank" rel="noreferrer" data-testid="link-booking-directions" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em]">Get directions <Navigation size={15} /></a></div></div></Reveal> : <Reveal className="mx-auto max-w-md py-6 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e1e8e1] text-[#f27a4b]"><CalendarDays size={27} /></div><h2 className="mt-6 font-display text-3xl font-bold tracking-[-.05em]">The pitch is waiting.</h2><p className="mt-3 text-sm leading-6 text-[#16233a]/55">Book a slot from the home page and it will show up here. No account, no noise.</p><button onClick={onBook} data-testid="button-empty-booking" className="mt-7 rounded-full bg-[#16233a] px-6 py-3 text-xs font-bold uppercase tracking-[.14em] text-[#f5f0e5] transition-transform hover:-translate-y-0.5">Find a pitch <ArrowUpRight size={15} className="ml-2 inline" /></button></Reveal>}</div></section></main>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const submit = (event: FormEvent) => { event.preventDefault(); localStorage.setItem('turf-contact', JSON.stringify({ ...form, createdAt: new Date().toISOString() })); setSent(true); };
  return <main><PageIntro eyebrow="Questions, collabs, rematches" title={<>SAY<br /><span className="text-[#f27a4b]">HELLO.</span></>} copy="Need to move a team, plan a tournament, or tell us about the best goal you scored at Turf? We read every message." /><section className="bg-[#f5f0e5] px-5 py-16 text-[#16233a] sm:px-8 sm:py-24"><div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[.8fr_1.2fr]"><Reveal><div><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#00a887]">The direct line</p><a href="tel:+918045555555" data-testid="link-contact-phone" className="mt-5 block font-display text-3xl font-bold tracking-[-.06em] hover:text-[#00a887] sm:text-5xl">+91 80 4555 5555</a><p className="mt-3 text-sm text-[#16233a]/55">Every day, 10 AM — midnight</p><div className="mt-12 border-t border-[#16233a]/15 pt-5"><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#00a887]">Elsewhere</p><div className="mt-4 flex gap-3"><a href="https://instagram.com" target="_blank" rel="noreferrer" data-testid="link-contact-instagram" className="grid h-11 w-11 place-items-center rounded-full border border-[#16233a]/20 hover:border-[#00a887] hover:text-[#00a887]"><Instagram size={18} /></a><a href="mailto:hello@turf.play" data-testid="link-contact-email" className="grid h-11 w-11 place-items-center rounded-full border border-[#16233a]/20 hover:border-[#00a887] hover:text-[#00a887]"><Mail size={18} /></a></div></div></div></Reveal><Reveal delay={100}><div className="rounded-[1.5rem] bg-[#e1e8e1] p-6 sm:p-9"><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#f27a4b]">Write it down</p>{sent ? <div className="flex min-h-[300px] flex-col items-center justify-center text-center"><div className="grid h-14 w-14 place-items-center rounded-full bg-[#00d5ac]"><Check size={26} /></div><h2 className="mt-5 font-display text-3xl font-bold">Message received.</h2><p className="mt-2 max-w-xs text-sm leading-6 text-[#16233a]/55">Someone from the Turf crew will get back to you shortly.</p><button onClick={() => { setSent(false); setForm({ name: '', phone: '', message: '' }); }} data-testid="button-send-another" className="mt-7 text-xs font-bold uppercase tracking-[.15em] underline underline-offset-4">Send another</button></div> : <form onSubmit={submit} className="mt-7 grid gap-5"><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-contact-name" className="field" placeholder="Your name" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">Phone or email<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="input-contact-phone" className="field" placeholder="How should we reach you?" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em]">Message<textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} data-testid="textarea-contact-message" className="field resize-none" placeholder="Tournament idea, feedback, rematch request..." /></label><button type="submit" data-testid="button-submit-contact" className="group flex items-center justify-between rounded-xl bg-[#16233a] px-5 py-4 text-xs font-bold uppercase tracking-[.15em] text-[#f5f0e5] transition-transform hover:-translate-y-0.5">Send message <Send size={17} className="transition-transform group-hover:translate-x-1" /></button></form>}</div></Reveal></div></section></main>;
}

function Router({ onBook, booking, onSaved, slotBookings }: { onBook: (time?: string) => void; booking: Booking | null; onSaved: (booking: Booking) => void; slotBookings: Record<string, string> }) {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location]);
  return <><Header onBook={onBook} /><RoutedErrorBoundary><Switch><Route path="/" component={() => <Home onBook={onBook} slotBookings={slotBookings} />} /><Route path="/about" component={About} /><Route path="/bookings" component={() => <Bookings booking={booking} onBook={onBook} />} /><Route path="/contact" component={Contact} /><Route component={NotFound} /></Switch></RoutedErrorBoundary><Footer /></>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [slotBookings, setSlotBookings] = useState<Record<string, string>>({});
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  useEffect(() => {
    setBooking(readBooking());
    setSlotBookings(readSlotBookings());
  }, []);
  const openBooking = (time?: string) => {
    setSelectedTime(time);
    setBookingOpen(true);
  };
  const saveSlotBooking = (time: string, name: string) => {
    setSlotBookings((current) => {
      const next = { ...current, [time]: name };
      localStorage.setItem('turf-slot-bookings', JSON.stringify(next));
      return next;
    });
  };
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router onBook={openBooking} booking={booking} onSaved={setBooking} slotBookings={slotBookings} /></WouterRouter><Toaster />{bookingOpen && <BookingModal initialTime={selectedTime} slotBookings={slotBookings} onSlotBooked={saveSlotBooking} onClose={() => setBookingOpen(false)} onSaved={setBooking} />}</TooltipProvider></QueryClientProvider>;
}

export default App;