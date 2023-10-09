import * as PIXI from 'pixi.js';
import { Gamemaster } from "../tetris/gamemaster";
import { PlayerContainer } from "./playerContainer";
import * as Zokka from "../zokka/ifu_zokka";

let scene: 'startMenu' | 'solo' | 'vsCom' = 'startMenu';

let mainPlayer: Gamemaster = new Gamemaster(false);
let opponentPlayer: Gamemaster = new Gamemaster(false);
const playerRenderArray: PlayerContainer[] = [];

// PixiJS
const app = new PIXI.Application<HTMLCanvasElement>({
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    resizeTo: window
});
const fpsText = new PIXI.Text('Loading...', { fontFamily: "sans-serif", fontSize: 20, fill: 0xffffff, stroke: 0x000000, strokeThickness: 6 });

let frameCount = 0;
let latestFpsTimer = Date.now();
let pastFps: number[] = [latestFpsTimer];
let fpsAvarage = 0;

setInterval(() => {
    let total = 0;
    for (let index = 0; index < pastFps.length; index++) {
        total += pastFps[index];
    }
    fpsAvarage = total / pastFps.length;
    pastFps = [];
    if (mainPlayer != null) {
        fpsText.text = fpsAvarage.toFixed(2) + 'fps\n';
        fpsText.text += JSON.stringify(mainPlayer.eventMessage).replace(/[\{,\}]/g, '\n');
    }
}, 1000);

(function loop() {
    frameCount++;
    if (frameCount % 10 === 0) {
        const now = Date.now();
        const thisFps = (1000 / ((now - latestFpsTimer) / 10));
        pastFps.push(thisFps);
        latestFpsTimer = now;
    }

    for (let index = 0; index < playerRenderArray.length; index++) {
        playerRenderArray[index].render();
    }
    requestAnimationFrame(loop);
})();

const startMenuContainer = new PIXI.Container();
const solo_button = PIXI.Sprite.from('img/button_solo.png');
solo_button.eventMode = 'static';
solo_button.addEventListener('click', startSolo);
const vs_button = PIXI.Sprite.from('img/button_vs.png');
vs_button.eventMode = 'static';
vs_button.addEventListener('click', startVS);
startMenuContainer.addChild(solo_button, vs_button);

const backgroundSprite = PIXI.Sprite.from('img/background.png');
backgroundSprite.anchor.set(0.5, 0.5);

app.stage.addChild(backgroundSprite, fpsText);

document.body.appendChild(app.view);

function startSolo() {
    {
        if (scene === 'startMenu') {
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

function startVS() {
    if (scene === 'startMenu' || scene === 'vsCom') {
        app.stage.removeChild(startMenuContainer);
        if (scene === 'vsCom') {
            mainPlayer.pause;
            destroyPlayerRenders();
        }
        scene = 'vsCom';
        mainPlayer = new Gamemaster();
        const mainRender = new PlayerContainer(window, mainPlayer, 1 / 4, 1 / 30 * 14);
        playerRenderArray.push(mainRender);

        opponentPlayer = new Gamemaster();
        const comRender = new PlayerContainer(window, opponentPlayer, 3 / 4, 1 / 30 * 14);
        playerRenderArray.push(comRender);

        app.stage.addChild(mainRender.container, comRender.container);

        mainPlayer.start();
        opponentPlayer.start();

        mainPlayer.addEventListener('nextTurn', e => {
            if (e.type === 'nextTurn') {
                opponentPlayer.damageAmountArray.push(e.attack);
            }
        });
        opponentPlayer.addEventListener('nextTurn', e => {
            if (e.type === 'nextTurn') {
                mainPlayer.damageAmountArray.push(e.attack);
            }
        });

        let running = true;
        let result = {
            finish: true,
            score: 0,
            mino: new Zokka.zokmino('t', new Zokka.zokfield(0, 0)),
            hold: false,
            clearline: 0,
            testlog: 0
        };

        (function comLoop() {
            setTimeout(() => {
                if (running) {
                    if (result.finish) {
                        result = Zokka.simulation(opponentPlayer.board.map(a => [...a]).reverse().splice(opponentPlayer.board.length - 20, 20), opponentPlayer.currentMino.minoType, opponentPlayer.turn.nextMinos[0], opponentPlayer.holdMino);

                        if (result.mino.type.match(/[io]/)) {
                            result.mino.x--;
                        }
                    } else {
                        if (result.hold) {
                            opponentPlayer.control.holdKey();
                            result.finish = true;
                        } else if (result.mino.angle !== opponentPlayer.currentMino.minoDirection) {
                            opponentPlayer.control.rotateClockwise();
                        } else if (result.mino.x !== opponentPlayer.currentMino.x) {
                            if (result.mino.x < opponentPlayer.currentMino.x) {
                                opponentPlayer.currentMino.moveHorizontally('left');
                            } else if (opponentPlayer.currentMino.x < result.mino.x) {
                                opponentPlayer.currentMino.moveHorizontally('right');
                            }
                        } else {
                            opponentPlayer.control.harddropKey();
                            result.finish = true;
                        }
                    }
                    if (mainPlayer.gameRunning && opponentPlayer.gameRunning) {
                        comLoop();
                    } else {
                        mainPlayer.gameRunning = false;
                        opponentPlayer.gameRunning = false;
                    }
                }
            }, 50);
        })();
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
    mainPlayer.pause();
    opponentPlayer.pause;
    destroyPlayerRenders();
    scene = 'startMenu';
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
                } else if (scene === 'vsCom') {
                    startVS();
                }
                break;
            case 'Escape':
                switch (scene) {
                    case 'solo':
                    case 'vsCom':
                        startMenu();
                        break;
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
