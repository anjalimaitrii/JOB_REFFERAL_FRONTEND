import { useRef, useState, useCallback, useEffect } from "react";
import { getSuccessStories } from "../../services/successStory.service";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
}

/*  Desktop Positions */
const INITIAL_POSITIONS = [
  { x: 60, y: 80 },
  { x: 360, y: 40 },
  { x: 660, y: 90 },
];

/* Types */
interface CardPos {
  x: number;
  y: number;
}

/* ⭐ Rating */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-white/20"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* Draggable Card (Desktop) */
function DraggableCard({
  t,
  pos,
  onPositionChange,
  index,
}: {
  t: Testimonial;
  pos: CardPos;
  onPositionChange: (id: string, pos: CardPos) => void;
  index: number;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const avatarHue = (index * 40) % 360;
  const rotation = index % 2 === 0 ? -3 : 2;
  const tapeHue = (index * 60) % 360;

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    cardX: 0,
    cardY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);

    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cardX: pos.x,
      cardY: pos.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;

    onPositionChange(t.id, {
      x: dragStart.current.cardX + dx,
      y: dragStart.current.cardY + dy,
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute w-72 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 select-none"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `rotate(${rotation}deg)`,
        cursor: "grab",
      }}
    >
      {/* Tape */}
      <div
        className="absolute -top-3 left-1/2 w-10 h-5 rounded-sm opacity-70"
        style={{
          transform: "translateX(-50%)",
          background: `hsl(${tapeHue} 70% 70%)`,
        }}
      />

      <StarRating rating={t.rating} />

      <p className="mt-2 text-white/90 text-sm leading-relaxed font-light">
        "{t.comment}"
      </p>

      <div className="mt-4 flex items-center gap-3 text-white">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            backgroundColor: `hsl(${avatarHue} 70% 60%)`,
            color: "#000",
          }}
        >
          {t.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-sm font-medium">{t.name}</p>
          <p className="text-xs text-yellow-400">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

/*  Mobile Card */
function MobileCard({ t, index }: { t: Testimonial; index: number }) {
  const avatarHue = (index * 40) % 360;

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
      <StarRating rating={t.rating} />

      <p className="mt-2 text-white/90 text-sm leading-relaxed font-light">
        "{t.comment}"
      </p>

      <div className="mt-4 flex items-center gap-3 text-white">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            backgroundColor: `hsl(${avatarHue} 70% 60%)`,
            color: "#000",
          }}
        >
          {t.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-sm font-medium">{t.name}</p>
          <p className="text-xs text-yellow-400">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessStories() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [positions, setPositions] = useState<CardPos[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await getSuccessStories();

        const data = res.data || [];

        setTestimonials(data);

        const generated = data.map((_: any, i: number) => ({
          x: 60 + i * 300,
          y: 80 + (i % 2 === 0 ? 0 : 40),
        }));

        setPositions(generated);
      } catch (err) {
        console.error("Failed to fetch stories");
      }
    };

    fetchStories();
  }, []);

  const handlePositionChange = useCallback(
    (id: string, pos: CardPos) => {
      setPositions((prev) =>
        prev.map((p, i) => (testimonials[i]?.id === id ? pos : p)),
      );
    },
    [testimonials],
  );

  return (
    <div
      className="flex flex-col mt-10"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, #ffd00022, transparent 40%),
          radial-gradient(circle at 80% 70%, #ffaa0022, transparent 40%),
          linear-gradient(160deg, #0a0a0a, #1a1a1a, #111111)
        `,
      }}
    >
      <div className="pt-16 pb-10 text-center">
        <h1 className="text-4xl font-semibold text-white">Success Stories</h1>
      </div>

      {!isMobile && (
        <div className="relative flex-1 min-h-[400px]">
          {testimonials.map((t, i) => (
            <DraggableCard
              key={t.id}
              t={t}
              pos={positions[i] || { x: 0, y: 0 }}
              onPositionChange={handlePositionChange}
              index={i}
            />
          ))}
        </div>
      )}

      {isMobile && (
        <div className="px-4 pb-14 grid gap-4">
          {testimonials.map((t, i) => (
            <MobileCard key={t.id} t={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
