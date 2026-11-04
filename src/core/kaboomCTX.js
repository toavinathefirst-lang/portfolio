import kaboom from "kaboom";

const canvas = /** @type {HTMLCanvasElement | null} */ (
  document.querySelector("canvas#game")
);

if (!canvas) throw new Error("Canvas #game introuvable dans index.html");

export const kaboomCtx = kaboom({
  global: false,
  touchToMouse: true,
  canvas,
});