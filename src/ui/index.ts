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
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
});;

const gm = new Gamemaster();
gm.start();

const player = new PlayerContainer(window, gm, 1 / 4, 1 / 30 * 14);
const fpsText = new PIXI.Text('0fps', { fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center' });
const background = PIXI.Sprite.from('img/background.png');
background.anchor.set(0.5, 0.5);
const backFrame = PIXI.Sprite.from('img/frame.png');
backFrame.anchor.set(0.5, 0.5);


function onResize() {
    background.position.set(window.innerWidth / 2, window.innerHeight / 2);
    background.width = window.innerHeight * 2 / 9 * 16;
    background.height = window.innerHeight * 2;
    backFrame.position.set(window.innerWidth * 1 / 4, window.innerHeight / 30 * 14);
    backFrame.width = window.innerHeight / 20 * 17 / 942 * 654;
    backFrame.height = window.innerHeight / 10 * 9;
}
onResize();
window.onresize = onResize;

app.stage.addChild(background, backFrame, player.container, fpsText);
document.body.appendChild(app.view);

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
