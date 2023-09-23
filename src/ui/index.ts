import { Gamemaster } from "../tetris/gamemaster";

const game = new Gamemaster();
game.start();
const gameElement = document.getElementById('game') ?? document.body;

document.addEventListener('keydown', e => {
    if (!e.repeat) {
        switch (e.key) {
            case 'ArrowUp':
                game.control.rotateClockwise();
                break;
            case 'ArrowRight':
                game.control.rightKeyDown();
                break;
            case 'ArrowDown':
                game.control.downKeyDown();
                break;
            case 'ArrowLeft':
                game.control.leftKeyDown();
                break;
            case 'c':
                game.control.holdKey();
                break;
            case 'z':
                game.control.rotateCounterclockwise();
                break;
            case ' ':
                game.control.harddropKey();
                break;
        }
    }
});
document.addEventListener('keyup', e => {
    if (!e.repeat) {
        switch (e.key) {
            case 'ArrowRight':
                game.control.rightKeyUp();
                break;
            case 'ArrowDown':
                game.control.downKeyUp();
                break;
            case 'ArrowLeft':
                game.control.leftKeyUp();
                break;
        }
    }
});

let fpsTimer = 0;
let FPS = 0;

(function loop() {
    if (fpsTimer === 0) {
        setTimeout(() => {
            FPS = fpsTimer;
            fpsTimer = 0;
        }, 1000);
    }
    fpsTimer++;

    const previousBoard = JSON.parse(JSON.stringify(game.board));
    game.fill(game.currentMino.getAbsoluteCoordinates(game.currentMino.x, game.currentMino.y), game.currentMino.minoType);
    const currentBoardString = JSON.stringify(game.board.slice(0,21).reverse());
    game.board = previousBoard;


    gameElement.innerText = `FPS: ${FPS}
board:
${currentBoardString.replace(/],/g, ']\n').replace(/""/g, '" "').replace(/("|,|((?<=\[)\[)|(](?=])))/g, '')}
next: ${game.turn.nextMinos}
hold: ${game.holdMino}
score: ${game.score}`;
    requestAnimationFrame(loop);
})();