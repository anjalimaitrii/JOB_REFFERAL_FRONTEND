"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";


/* ================= CARD ================= */

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onClick,
  }: {
    card: { title: string; src: string; footer?: React.ReactNode };
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onClick?: () => void;
  }) => {
    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={onClick}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-900 h-60 md:h-96 w-full transition-all duration-300",
          hovered !== null && hovered !== index && "blur-sm scale-[0.97]"
        )}
      >
        <img
          src={card.src}
          alt={card.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className={cn(
            "absolute inset-0 flex items-end bg-black/50 px-4 py-6 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            {card.title}
          </h3>
          {card.footer && (
    <div className="mt-3">{card.footer}</div>
  )}
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

/* ================= TYPES ================= */

type FocusCard = {
  title: string;
  src: string;
  footer?: React.ReactNode;
};

/* ================= FOCUS CARDS ================= */

export function FocusCards({
  cards,
  onCardClick,
}: {
  cards: FocusCard[];
  onCardClick?: (index: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card
          key={index}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          onClick={() => onCardClick?.(index)}
        />
      ))}
    </div>
  );
}
