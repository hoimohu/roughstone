import * as PIXI from 'pixi.js';
import { Gamemaster } from "../tetris/gamemaster";
import { PlayerContainer } from "./playerContainer";


document.addEventListener('keydown', e => {
    if (!e.repeat) {
        switch (e.key) {
            case 'ArrowUp':
                gm.control.rotateClockwise();
                break;
            case 'ArrowRight':
                gm.control.rightKeyDown();
                break;
            case 'ArrowDown':
                gm.control.downKeyDown();
                break;
            case 'ArrowLeft':
                gm.control.leftKeyDown();
                break;
            case 'c':
                gm.control.holdKey();
                break;
            case 'z':
                gm.control.rotateCounterclockwise();
                break;
            case ' ':
                gm.control.harddropKey();
                break;
        }
    }
});
document.addEventListener('keyup', e => {
    if (!e.repeat) {
        switch (e.key) {
            case 'ArrowRight':
                gm.control.rightKeyUp();
                break;
            case 'ArrowDown':
                gm.control.downKeyUp();
                break;
            case 'ArrowLeft':
                gm.control.leftKeyUp();
                break;
        }
    }
});

// PixiJS
const app = new PIXI.Application<HTMLCanvasElement>({
    backgroundColor: 0xEBF8FF,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
});;
document.body.appendChild(app.view);

const gm = new Gamemaster();
gm.start();

const player = new PlayerContainer(window, gm, innerWidth / 2, innerHeight / 2);
app.stage.addChild(player.container);

const fpsText = new PIXI.Text('0fps', { fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center' });
app.stage.addChild(fpsText);

let fpsTimer = 0;
let FPS = 0;

(function loop() {
    if (fpsTimer === 0) {
        setTimeout(() => {
            FPS = fpsTimer;
            fpsTimer = 0;

            fpsText.text = FPS + 'fps';
        }, 1000);
    }
    fpsTimer++;

    player.render();
    requestAnimationFrame(loop);
})();