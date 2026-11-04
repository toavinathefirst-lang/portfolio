import './style.css'
import spritesheetUrl from "./core/spritesheet.png";
import mapUrl from "./assets/images/map.png";
import MAPDATA from "./core/map.json"
import { kaboomCtx } from "./core/kaboomCTX";
import { SCALEFACTOR } from './core/constants';
/** @type {import("./core/mapTypes").Layer[]} */
const layers = /** @type {any} */ (MAPDATA).layers;
kaboomCtx.loadSprite("spritesheet", spritesheetUrl, {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
    "idle-side": 975,
    "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
  },
});
kaboomCtx.loadSprite("map",mapUrl)
kaboomCtx.setBackground(kaboomCtx.Color.fromHex("311047"))
kaboomCtx.scene("main", () => {
  const layers = MAPDATA.layers;
  const map = kaboomCtx.make([
    kaboomCtx.sprite("map"),kaboomCtx.pos(0),kaboomCtx.scale(SCALEFACTOR)
  ])
  //....
});
kaboomCtx.go("main")