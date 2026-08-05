import React from 'react';

import spriteMap from '@/../public/icons/spell-effects-sprite.json';

// The sprite sheet is an 8-column grid of 64×64px source icons.
const SPRITE_COLS = 8;
const SOURCE_SIZE = 64;
const ICON_COUNT = Object.keys(spriteMap).length;

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  /** Sprite key — the icon filename stem, e.g. 'FIDG', 'PARA'. */
  icon: string;
  /** Rendered size in px. Source icons are 64×64 and scale proportionally. */
  size: number;
  alt: string;
  className?: string;
}

/**
 * Renders a single spell effect icon from the combined sprite sheet
 * (public/icons/spell-effects-sprite.png) using CSS background-position.
 *
 * Using a sprite avoids 126 individual /_next/image requests and serves the
 * single PNG directly as a static file with no image-optimization pipeline.
 *
 * Uses React.forwardRef so MUI Tooltip (and other ref-forwarding wrappers) can
 * attach event listeners to the underlying DOM element without warnings.
 */
const SpellEffectIcon = React.forwardRef<HTMLSpanElement, Props>(
  function SpellEffectIcon({ icon, size, alt, className, ...props }, ref) {
    const entry = spriteMap[icon as keyof typeof spriteMap];

    if (!entry) {
      // Fallback: transparent placeholder so layout doesn't break.
      return <span ref={ref} {...props} style={{ display: 'inline-block', width: size, height: size }} aria-hidden />;
    }

    // Scale the background so the sprite renders at `size` px per cell.
    // Source sprite is SPRITE_COLS * SOURCE_SIZE wide; at `size` px per cell it
    // should be SPRITE_COLS * size wide.
    const scale = size / SOURCE_SIZE;
    const bgWidth = SPRITE_COLS * SOURCE_SIZE * scale;
    const bgHeight = Math.ceil(ICON_COUNT / SPRITE_COLS) * SOURCE_SIZE * scale;

    const bgX = -(entry.x * scale);
    const bgY = -(entry.y * scale);

    return (
      <span
        ref={ref}
        {...props}
        role="img"
        aria-label={alt}
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          flexShrink: 0,
          backgroundImage: "url('/icons/spell-effects-sprite.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${bgWidth}px ${bgHeight}px`,
          backgroundPosition: `${bgX}px ${bgY}px`,
        }}
      />
    );
  }
);

export default SpellEffectIcon;
