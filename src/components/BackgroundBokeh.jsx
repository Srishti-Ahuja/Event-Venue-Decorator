import React, { memo } from 'react';

/**
 * Animated background featuring soft-blurred, glowing hot-pink (#FF1493)
 * and warm-gold (#FFB800) bokeh circles simulating a romantic fairy-light aesthetic.
 */
export const BackgroundBokeh = memo(function BackgroundBokeh() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Deep Charcoal Dark base gradient */}
      <div className="absolute inset-0 bg-radial from-[#15151c] via-[#0F0F12] to-[#0a0a0d] opacity-90" />

      {/* Bokeh Circle 1: Vibrant Hot Pink - Top Left */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 md:w-[32rem] md:h-[32rem] rounded-full bg-hotpink-500/15 blur-[120px] animate-float-slow"
        style={{ animationDuration: '14s' }}
      />

      {/* Bokeh Circle 2: Warm Gold - Top Center / Right */}
      <div
        className="absolute top-1/4 right-5 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-warmgold-500/10 blur-[130px] animate-float-reverse"
        style={{ animationDuration: '18s' }}
      />

      {/* Bokeh Circle 3: Romantic Magenta/Pink - Center Left */}
      <div
        className="absolute top-1/2 -left-20 w-72 h-72 md:w-[26rem] md:h-[26rem] rounded-full bg-hotpink-600/12 blur-[110px] animate-pulse-subtle"
        style={{ animationDuration: '7s' }}
      />

      {/* Bokeh Circle 4: Warm Fairy-Light Amber - Bottom Center */}
      <div
        className="absolute -bottom-24 left-1/3 w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-full bg-amber-400/10 blur-[140px] animate-float-slow"
        style={{ animationDuration: '16s' }}
      />

      {/* Bokeh Circle 5: Hot Pink Accent - Bottom Right */}
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 md:w-[30rem] md:h-[30rem] rounded-full bg-hotpink-500/15 blur-[125px] animate-float-reverse"
        style={{ animationDuration: '12s' }}
      />

      {/* Subtle Micro-Twinkle Fairy Dots */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ff1493_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
});
