import * as PIXI from 'pixi.js';
import * as Data from './data';
import { PlayerContainer } from './playerContainer';

export class BoardContainer {
    /**PlayerContainer */
    PC: PlayerContainer;

    /**盤面の描画上の横幅 */
    readonly width: number = 10;
    /**盤面の描画上の高さ */
    readonly height: number = 21;

    /**コンテナ */
    container = new PIXI.Container();

    /**盤面のブロックのスプライト */
    boardSprites: PIXI.Sprite[][];
    /**盤面のミノの影のスプライト */
    shadowSprites: PIXI.Sprite[];

    constructor(playerContainer: PlayerContainer) {
        this.PC = playerContainer;
        // 盤面の配列の作成
        const newBoardSprites: PIXI.Sprite[][] = [];
        for (let rowCount = 0; rowCount < this.height; rowCount++) {
            const newRow: PIXI.Sprite[] = [];
            for (let columnCount = 0; columnCount < this.width; columnCount++) {
                const newSprite = new PIXI.Sprite(this.PC.blockTexture);
                newSprite.width = this.PC.blockSize;
                newSprite.height = this.PC.blockSize;
                this.container.addChild(newSprite);
                newRow.push(newSprite);
            }
            newBoardSprites.push(newRow);
        }
        this.boardSprites = newBoardSprites;
        // 盤面のミノの影の配列の作成
        const newShadowSprites: PIXI.Sprite[] = [];
        for (let count = 0; count < 4; count++) {
            const newSprite = new PIXI.Sprite(this.PC.shadowTexture);
            newSprite.x = -10 * this.PC.blockSize;
            newSprite.y = -10 * this.PC.blockSize;
            newSprite.width = this.PC.blockSize;
            newSprite.height = this.PC.blockSize;
            this.container.addChild(newSprite);
            newShadowSprites.push(newSprite);
        }
        this.shadowSprites = newShadowSprites;

        this.updatePosition();
    }

    render() {
        /**現在の盤面とミノ */
        const currentBoard = this.PC.GM.board.map(a => [...a]);
        if (this.PC.GM.currentMino.visible) {
            const currentMinoPosition = this.PC.GM.currentMino.getAbsoluteCoordinates(this.PC.GM.currentMino.x, this.PC.GM.currentMino.y);
            for (let index = 0; index < currentMinoPosition.length; index++) {
                const element = currentMinoPosition[index];
                if (0 <= element[1] && element[1] < currentBoard.length) {
                    currentBoard[element[1]][element[0]] = this.PC.GM.currentMino.minoType;
                }
            }
        }

        // いろぬり
        for (let rowIndex = 0; rowIndex < this.boardSprites.length; rowIndex++) {
            const row = this.boardSprites[rowIndex];
            for (let collumnIndex = 0; collumnIndex < row.length; collumnIndex++) {
                const sprite = row[collumnIndex];
                switch (currentBoard[rowIndex][collumnIndex]) {
                    case 'i':
                        sprite.tint = Data.blockColor.i;
                        break;
                    case 't':
                        sprite.tint = Data.blockColor.t;
                        break;
                    case 's':
                        sprite.tint = Data.blockColor.s;
                        break;
                    case 'z':
                        sprite.tint = Data.blockColor.z;
                        break;
                    case 'j':
                        sprite.tint = Data.blockColor.j;
                        break;
                    case 'l':
                        sprite.tint = Data.blockColor.l;
                        break;
                    case 'o':
                        sprite.tint = Data.blockColor.o;
                        break;
                    case 'd':
                        sprite.tint = Data.blockColor.d;
                        break;
                    case '':
                        sprite.tint = Data.blockColor.blank;
                        break;
                }
            }
        }

        /**ミノの影の座標 */
        const currentMinoShadow = this.PC.GM.currentMino.shadowPosition;
        for (let index = 0; index < this.shadowSprites.length; index++) {
            const element = this.shadowSprites[index];
            element.tint = Data.blockColor[this.PC.GM.currentMino.minoType];
            if (this.PC.GM.currentMino.visible) {
                element.visible = true;
                if (0 <= currentMinoShadow[index][1] && currentMinoShadow[index][1] < this.boardSprites.length) {
                    element.x = this.boardSprites[currentMinoShadow[index][1]][currentMinoShadow[index][0]].x;
                    element.y = this.boardSprites[currentMinoShadow[index][1]][currentMinoShadow[index][0]].y;
                } else {
                    element.x = -10 * this.PC.blockSize;
                    element.y = -10 * this.PC.blockSize;
                }
            } else {
                element.visible = false;
            }
        }
    }

    /**位置とブロックのサイズの更新 */
    updatePosition() {
        for (let rowIndex = 0; rowIndex < this.boardSprites.length; rowIndex++) {
            const row = this.boardSprites[rowIndex];
            for (let collumnIndex = 0; collumnIndex < row.length; collumnIndex++) {
                const sprite = row[collumnIndex];
                sprite.x = this.PC.centerX + (collumnIndex - 5) * this.PC.blockSize;
                sprite.y = this.PC.centerY - (rowIndex - 10) * this.PC.blockSize;
                sprite.width = this.PC.blockSize;
                sprite.height = this.PC.blockSize;
            }
        }
        /**ミノの影の座標 */
        const currentMinoShadow = this.PC.GM.currentMino.shadowPosition;
        for (let index = 0; index < this.shadowSprites.length; index++) {
            const element = this.shadowSprites[index];
            element.tint = Data.blockColor[this.PC.GM.currentMino.minoType];
            if (this.PC.GM.currentMino.visible) {
                element.visible = true;
                if (0 <= currentMinoShadow[index][1] && currentMinoShadow[index][1] < this.boardSprites.length) {
                    element.x = this.boardSprites[currentMinoShadow[index][1]][currentMinoShadow[index][0]].x;
                    element.y = this.boardSprites[currentMinoShadow[index][1]][currentMinoShadow[index][0]].y;
                } else {
                    element.x = -10 * this.PC.blockSize;
                    element.y = -10 * this.PC.blockSize;
                }
                element.width = this.PC.blockSize;
                element.height = this.PC.blockSize;
            } else {
                element.visible = false;
            }
        }
    }

    /**ブロックのテクスチャーを更新する */
    updateBlockTexture() {
        for (let rowIndex = 0; rowIndex < this.boardSprites.length; rowIndex++) {
            const row = this.boardSprites[rowIndex];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                row[columnIndex].texture = this.PC.blockTexture;
            }
        }
    }
    /**ミノの影のテクスチャーを更新する */
    updateShadowTexture() {
        for (let index = 0; index < this.shadowSprites.length; index++) {
            const element = this.shadowSprites[index];
            element.texture = this.PC.shadowTexture;
        }
    }
}