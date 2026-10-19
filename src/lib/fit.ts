/**
 * How much of a `w × h` design box fits its container, as a unitless number.
 *
 * CSS cannot divide one length by another, but the tangent of an atan2 of two
 * lengths is exactly their ratio — so this builds
 * `min(100cqw / w, 100cqh / h, max)` in pure CSS. The container units resolve
 * against whatever declares `container-type: size`, which is the scene's stage.
 *
 * Sizing the drawing in the stylesheet rather than in an effect is what lets a
 * scene be correct on the very first paint: nothing to measure, no ref, no
 * frame where the drawing is the wrong size.
 */
export function fitScale(w: number, h: number, max = 1) {
  return `min(tan(atan2(100cqw, ${w}px)), tan(atan2(100cqh, ${h}px)), ${max})`;
}
