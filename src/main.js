import "./style.css";
import spritesheetUrl from "./core/spritesheet.png";
import mapUrl from "./assets/images/map.png";
import MAPDATA from "./core/map.json";
import { kaboomCtx } from "./core/kaboomCTX";
import { SCALEFACTOR } from "./core/constants";
import { displayDialogue } from "./core/utils";

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

kaboomCtx.loadSprite("map", mapUrl);
kaboomCtx.setBackground(kaboomCtx.Color.fromHex("311047"));

kaboomCtx.scene("main", () => {
  const map = kaboomCtx.add([
    kaboomCtx.sprite("map"),
    kaboomCtx.pos(0),
    kaboomCtx.scale(SCALEFACTOR),
  ]);

  const player = kaboomCtx.make([
    kaboomCtx.sprite("spritesheet", { anim: "idle-down" }),
    kaboomCtx.area({
      shape: new kaboomCtx.Rect(kaboomCtx.vec2(0, 3), 10, 10),
    }),
    kaboomCtx.body(),
    kaboomCtx.anchor("center"),
    kaboomCtx.pos(),
    kaboomCtx.scale(SCALEFACTOR),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

  for (const layer of layers) {
    
    if (layer.type !== "objectgroup") continue;

    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          kaboomCtx.area({
            shape: new kaboomCtx.Rect(
              kaboomCtx.vec2(0),
              boundary.width,
              boundary.height
            ),
          }),
          kaboomCtx.body({ isStatic: true }),
          kaboomCtx.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true;
            displayDialogue("TODO", () => {
              player.isInDialogue = false;
            });
          });
        }
      }
      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if(entity.name==="player"){
          player.pos = kaboomCtx.vec2(
            (map.pos.x +entity.x) *SCALEFACTOR,
            (map.pos.y + entity.y) * SCALEFACTOR
          );
          kaboomCtx.add(player)
          continue
        }
      }
    }
  }

  kaboomCtx.onUpdate(()=>{
    kaboomCtx.camPos(player.pos.x,player.pos.y +100)
  })
});

kaboomCtx.go("main");