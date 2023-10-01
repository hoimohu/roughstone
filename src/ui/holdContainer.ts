import * as PIXI from 'pixi.js';
import * as Data from './data';
import { PlayerContainer } from './playerContainer';

export class HoldContainer {
    /**PlayerContainer */
    PC: PlayerContainer;

    /**ホールドの表示の幅 */
    readonly width = 4;
    /**ホールドの表示の高さ */
    readonly height = 2;

    /**コンテナ */
    container = new PIXI.Container();

    /**ホールドのブロックのスプライト */
    holdSprites: PIXI.Sprite[][];

    constructor(playerContainer: PlayerContainer) {
        this.PC = playerContainer;
        // 盤面の配列の作成
        const newHoldSprites: PIXI.Sprite[][] = [];
        for (let rowCount = 0; rowCount < this.height; rowCount++) {
            const newRow: PIXI.Sprite[] = [];
            for (let columnCount = 0; columnCount < this.width; columnCount++) {
                const newSprite = new PIXI.Sprite(this.PC.blockTexture);
                this.container.addChild(newSprite);
                newRow.push(newSprite);
            }
            newHoldSprites.push(newRow);
        }
        this.holdSprites = newHoldSprites;

        this.updatePosition();
    }

    render() {
        const holdMino = this.PC.GM.holdMino;

        // いろぬり
        for (let rowIndex = 0; rowIndex < this.holdSprites.length; rowIndex++) {
            const row = this.holdSprites[rowIndex];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                row[columnIndex].visible = false;
            }
        }
        if (holdMino !== 'none') {
            const holdMinoShape = Data.minoShapes[holdMino];
            for (let index = 0; index < holdMinoShape.length; index++) {
                const element = holdMinoShape[index];
                const sprite = this.holdSprites[element[1]][element[0]];
                sprite.tint = Data.blockColor[holdMino];
                sprite.visible = true;
            }
        }

    }

    updatePosition() {
        for (let rowIndex = 0; rowIndex < this.holdSprites.length; rowIndex++) {
            const row = this.holdSprites[rowIndex];
            for (let collumnIndex = 0; collumnIndex < row.length; collumnIndex++) {
                const sprite = row[collumnIndex];
                sprite.x = this.PC.centerX - this.PC.blockSize * 10 + collumnIndex * this.PC.blockSize;
                sprite.y = this.PC.centerY - 10 * this.PC.blockSize - rowIndex * this.PC.blockSize + this.PC.blockSize;
                sprite.width = this.PC.blockSize;
                sprite.height = this.PC.blockSize;
            }
        }
    }

    /**ブロックのテクスチャーを更新する */
    updateBlockTexture() {
        for (let rowIndex = 0; rowIndex < this.holdSprites.length; rowIndex++) {
            const row = this.holdSprites[rowIndex];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                row[columnIndex].texture = this.PC.blockTexture;
            }
        }
    }
}