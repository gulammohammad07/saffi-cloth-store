"use client";

import { m as motion } from "framer-motion";
import type { FragranceNote } from "@/lib/data/products";

function NoteBar({ note, delay }: { note: FragranceNote; delay: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{note.name}</span>
        <span className="text-xs text-ink/60">✦</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#1C1A17]/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${note.intensity}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#93371A] to-gold"
        />
      </div>
    </div>
  );
}

export default function NotesPyramid({
  notes,
}: {
  notes: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
}) {
  const layers = [
    { key: "top", label: "Style", sub: "The first thing you notice", notes: notes.top },
    { key: "heart", label: "Comfort", sub: "How it feels on", notes: notes.heart },
    { key: "base", label: "Finish", sub: "The details that last", notes: notes.base },
  ];

  return (
    <div className="space-y-8">
      {layers.map((layer, layerIndex) => (
        <div key={layer.key}>
          <div className="mb-4">
            <h4 className="font-display text-base font-medium text-ink">
              {layer.label}
            </h4>
            <p className="text-xs text-ink/60">{layer.sub}</p>
          </div>

          <div className="space-y-3">
            {layer.notes.map((note, i) => (
              <NoteBar
                key={note.name}
                note={note}
                delay={0.1 * (i + 1) + layerIndex * 0.2}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
