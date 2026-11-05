import { kaboomCtx as k } from "./kaboomCTX";
import houseUrl from "../assets/sounds/house.mp3";
import pcUrl from "../assets/sounds/pc.mp3";
import bookUrl from "../assets/sounds/book.mp3";
import defaultUrl from "../assets/sounds/default.mp3";

const MUSIC_VOLUME = 0.05;

/** Volume de chaque effet sonore (0 à 1). */
const SFX_VOLUMES = {
  pc: 0.04,      // baisse ou monte cette valeur
  book: 0.6,
  default: 0.6,
};


const SFX_BY_OBJECT = {
  pc: "pc",
  resume: "book",
  library: "book",
};

export function loadSounds() {
  k.loadSound("house", houseUrl);
  k.loadSound("pc", pcUrl);
  
  k.loadSound("book", bookUrl);
  k.loadSound("default", defaultUrl);
}


export function setupBackgroundMusic() {
  const music = k.play("house", { loop: true, volume: MUSIC_VOLUME });

  const resume = () => {
    if (k.audioCtx.state === "suspended") k.audioCtx.resume();
  };
  k.onMousePress(resume);
  k.onKeyPress(resume);

 
  k.onKeyPress("r", () => {
    music.paused = !music.paused;
  });
}

/** @type {import("kaboom").AudioPlay | null} */
let currentSfx = null;

/**
 * Joue le son associé à un objet de la carte.
 * @param {string} objectName
 */
export function playObjectSound(objectName) {
  currentSfx?.stop();

  const soundName =
    SFX_BY_OBJECT[/** @type {keyof typeof SFX_BY_OBJECT} */ (objectName)] ?? "default";

  currentSfx = k.play(soundName, {
    volume: SFX_VOLUMES[/** @type {keyof typeof SFX_VOLUMES} */ (soundName)],
  });
}