import * as PIXI from 'pixi.js';
import { Gamemaster } from "../tetris/gamemaster";
import { PlayerContainer } from "./playerContainer";

let scene: 'startMenu' | 'solo' = 'startMenu';

let mainPlayer: Gamemaster;
const playerRenderArray: PlayerContainer[] = [];

// PixiJS
const app = new PIXI.Application<HTMLCanvasElement>({
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
});
const fpsText = new PIXI.Text('0fps', { fontFamily: "sans-serif", fontSize: 20, fill: 0xffffff, stroke: 0x000000, strokeThickness: 6 });

app.stage.addChild(fpsText);
document.body.appendChild(app.view);

let fpsTimer = 0;
let FPS = 0;

(function loop() {
    if (fpsTimer === 0) {
        setTimeout(() => {
            FPS = fpsTimer;
            fpsTimer = 0;

            fpsText.text = FPS + 'fps';
            if (mainPlayer != null) {
                fpsText.text += JSON.stringify(mainPlayer.eventMessage);
            }
        }, 1000);
    }
    fpsTimer++;

    for (let index = 0; index < playerRenderArray.length; index++) {
        playerRenderArray[index].render();
    }
    requestAnimationFrame(loop);
})();

const startMenuContainer = new PIXI.Container();
const solo_button = PIXI.Sprite.from('img/button_solo.png');
const vs_button = PIXI.Sprite.from('img/button_vs.png');
solo_button.eventMode = 'static';
solo_button.addEventListener('click', startSolo);
startMenuContainer.addChild(solo_button, vs_button);

const backgroundSprite = PIXI.Sprite.from('img/background.png');
backgroundSprite.anchor.set(0.5, 0.5);
app.stage.addChild(backgroundSprite);

function startSolo() {
    {
        if (scene === 'startMenu') {
            destroyPlayerRenders();
            app.stage.removeChild(startMenuContainer);
            scene = 'solo';
            mainPlayer = new Gamemaster();
            mainPlayer.start();
            const player = new PlayerContainer(window, mainPlayer, 1 / 4, 1 / 30 * 14);
            playerRenderArray.push(player);
            app.stage.addChild(player.container);
        } else if (scene === 'solo') {
            mainPlayer.pause();
            destroyPlayerRenders();
            app.stage.removeChild(startMenuContainer);
            mainPlayer = new Gamemaster();
            mainPlayer.start();
            const player = new PlayerContainer(window, mainPlayer, 1 / 4, 1 / 30 * 14);
            playerRenderArray.push(player);
            app.stage.addChild(player.container);
        }
    }
}

function destroyPlayerRenders() {
    const playerRenders = [];
    while (playerRenderArray.length !== 0) {
        const playerContainer = playerRenderArray.shift();
        if (playerContainer !== undefined) {
            playerRenders.push(playerContainer.container);
        }
    }
    app.stage.removeChild(...playerRenders);
}

function startMenu() {
    app.stage.addChild(startMenuContainer);
}

function resize() {
    backgroundSprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
    backgroundSprite.width = window.innerHeight * 2 / 9 * 16;
    backgroundSprite.height = window.innerHeight * 2;

    solo_button.x = innerWidth - 700;
    solo_button.y = innerHeight / 5 * 2;
    solo_button.width = innerHeight / 5 * 4;
    solo_button.height = innerHeight / 6;
    vs_button.x = innerWidth - 700;
    vs_button.y = innerHeight / 5 * 2 + 220;
    vs_button.width = innerHeight / 5 * 4;
    vs_button.height = innerHeight / 6;
}
resize();
window.onresize = resize;
window.onload = () => {
    resize();
    startMenu();
};

document.addEventListener('keydown', e => {
    if (!e.repeat && mainPlayer instanceof Gamemaster) {
        switch (e.key) {
            case 'ArrowUp':
                mainPlayer.control.rotateClockwise();
                break;
            case 'ArrowRight':
                mainPlayer.control.rightKeyDown();
                break;
            case 'ArrowDown':
                mainPlayer.control.downKeyDown();
                break;
            case 'ArrowLeft':
                mainPlayer.control.leftKeyDown();
                break;
            case 'c':
                mainPlayer.control.holdKey();
                break;
            case 'z':
                mainPlayer.control.rotateCounterclockwise();
                break;
            case ' ':
                mainPlayer.control.harddropKey();
                break;
            case 'r':
                if (scene === 'solo') {
                    startSolo();
                }
                break;
            case 'Escape':
                if (scene === 'solo') {
                    mainPlayer.pause();
                    destroyPlayerRenders();
                    startMenu();
                }
                break;
        }
    }
});
document.addEventListener('keyup', e => {
    if (!e.repeat && mainPlayer instanceof Gamemaster) {
        switch (e.key) {
            case 'ArrowRight':
                mainPlayer.control.rightKeyUp();
                break;
            case 'ArrowDown':
                mainPlayer.control.downKeyUp();
                break;
            case 'ArrowLeft':
                mainPlayer.control.leftKeyUp();
                break;
        }
    }
});
