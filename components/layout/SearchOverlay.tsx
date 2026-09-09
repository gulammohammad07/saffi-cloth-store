"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m as motion, AnimatePresence } from "framer-motion";
import { Mic, Search, TrendingUp, X } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

const popularSearches = ["Kurta", "Saree", "Dress", "Jeans", "Shirt", "Gift"];

type SpeechRecognitionLike = {
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: {
    results: { [index: number]: { transcript: string }[] };
  }) => void) | null;
  start: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length === 0) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled) setResults(data.results ?? []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const startVoiceSearch = () => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SpeechRecognition = win.SpeechRecognition ?? win.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.start();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-charcoal/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mx-auto mt-20 max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-dark rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Search size={20} className="text-gold" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by product, category or brand..."
                  className="flex-1 bg-transparent text-base text-cream placeholder:text-cream/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={`rounded-full p-2 transition-colors ${
                    listening
                      ? "bg-gold text-white"
                      : "text-cream/60 hover:text-gold"
                  }`}
                  aria-label="Voice search"
                >
                  <Mic size={18} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-cream/60 hover:text-white"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              {listening && (
                <p className="mt-4 flex items-center gap-2 text-sm text-gold">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
                  Listening... speak now
                </p>
              )}

              {query.trim().length === 0 ? (
                <div className="mt-5">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-cream/60 uppercase">
                    <TrendingUp size={14} /> Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-cream/60 transition-colors hover:border-gold hover:text-gold"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searching && results.length === 0 ? (
                <p className="mt-6 flex items-center gap-2 text-sm text-cream/60">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
                  Searching the collection...
                </p>
              ) : results.length === 0 ? (
                <p className="mt-6 text-sm text-cream/60">
                  No results for &quot;{query}&quot;. Try &quot;Kurta&quot; or &quot;Saree&quot;.
                </p>
              ) : (
                <ul className="mt-5 space-y-3">
                  {results.slice(0, 6).map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-white/5"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-cream">
                            {product.name}
                          </p>
                          <p className="text-xs text-cream/60">
                            {product.brand} • {product.category}
                          </p>
                        </div>
                        <p className="text-sm text-gold">
                          {formatPrice(product.salePrice ?? product.price)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
