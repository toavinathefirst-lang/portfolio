import "./style.css";
import spritesheetUrl from "./core/spritesheet.png";
import mapUrl from "./assets/images/map.png";
import MAPDATA from "./core/map.json";
import { kaboomCtx } from "./core/kaboomCTX";
import { dialogueData, SCALEFACTOR } from "./core/constants";
import { displayDialogue, setCamScale } from "./core/utils";
import { loadSounds, setupBackgroundMusic, playObjectSound } from "./core/audio";

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
loadSounds();
kaboomCtx.setBackground(kaboomCtx.Color.fromHex("311047"));

kaboomCtx.scene("main", () => {
  setupBackgroundMusic();

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
      direction: /** @type {"up" | "down" | "left" | "right"} */ ("down"),
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

        const name = boundary.name;
        const text = name ? dialogueData[name] : undefined;

        if (name && text) {
          player.onCollide(name, () => {
            if (player.isInDialogue) return;
            player.isInDialogue = true;
            playObjectSound(name);
            displayDialogue(text, () => {
              player.isInDialogue = false;
            });
          });
        }
      }
      continue;
    }

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = kaboomCtx.vec2(
            (map.pos.x + entity.x) * SCALEFACTOR,
            (map.pos.y + entity.y) * SCALEFACTOR
          );
          kaboomCtx.add(player);
        }
      }
    }
  }

  setCamScale(kaboomCtx);
  kaboomCtx.onResize(() => setCamScale(kaboomCtx));
  kaboomCtx.onUpdate(() => {
    kaboomCtx.camPos(player.pos.x, player.pos.y + 100);
  });

  // Déplacement
  kaboomCtx.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;

    const worldMousePos = kaboomCtx.toWorld(kaboomCtx.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);
    const LOWER_BOUND = 50;
    const UPPER_BOUND = 125;

    if (mouseAngle > LOWER_BOUND && mouseAngle < UPPER_BOUND) {
      if (player.curAnim() !== "walk-up") player.play("walk-up");
      player.direction = "up";
      return;
    }

    if (mouseAngle < -LOWER_BOUND && mouseAngle > -UPPER_BOUND) {
      if (player.curAnim() !== "walk-down") player.play("walk-down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) < LOWER_BOUND) {
      player.flipX = true;
      if (player.curAnim() !== "walk-side") player.play("walk-side");
      player.direction = "left";
      return;
    }

    player.flipX = false;
    if (player.curAnim() !== "walk-side") player.play("walk-side");
    player.direction = "right";
  });

  function stopAnims() {
    if (player.direction === "down") return player.play("idle-down");
    if (player.direction === "up") return player.play("idle-up");
    player.play("idle-side");
  }

  kaboomCtx.onMouseRelease(stopAnims);
});

kaboomCtx.go("main");