import * as PIXI from 'pixi.js';
import * as Data from './data';
import { PlayerContainer } from './playerContainer';

export class NextContainer {
    /**PlayerContainer */
    PC: PlayerContainer;

    /**見れるネクストの数 */
    visibleNextCount: number;
    /**ネクストの表示の幅 */
    readonly width = 4;
    /**ネクストの表示の高さ */
    readonly height = 2;

    /**コンテナ */
    container = new PIXI.Container();

    /**ネクストのブロックのスプライト */
    nextSprites: PIXI.Sprite[][][];

    constructor(playerContainer: PlayerContainer, visibleNextCount: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 5) {
        this.PC = playerContainer;
        this.visibleNextCount = visibleNextCount;
        // 盤面の配列の作成
        const newNextSprites: PIXI.Sprite[][][] = [];
        for (let index = 0; index < visibleNextCount; index++) {
            const mino: PIXI.Sprite[][] = [];
            for (let rowCount = 0; rowCount < this.height; rowCount++) {
                const newRow: PIXI.Sprite[] = [];
                for (let columnCount = 0; columnCount < this.width; columnCount++) {
                    const newSprite = new PIXI.Sprite(this.PC.blockTexture);
                    this.container.addChild(newSprite);
                    newRow.push(newSprite);
                }
                mino.push(newRow);
            }
            newNextSprites.push(mino);
        }
        this.nextSprites = newNextSprites;

        this.updatePosition();
    }

    render() {
        const nextMinos = this.PC.GM.turn.nextMinos;
        // いろぬり
        for (let nextIndex = 0; nextIndex < this.nextSprites.length; nextIndex++) {
            const next = this.nextSprites[nextIndex];
            for (let rowIndex = 0; rowIndex < next.length; rowIndex++) {
                const row = next[rowIndex];
                for (let collumnIndex = 0; collumnIndex < row.length; collumnIndex++) {
                    const sprite = row[collumnIndex];
                    sprite.visible = false;
                }
            }
        }
        for (let nextIndex = 0; nextIndex < this.nextSprites.length && nextIndex < nextMinos.length; nextIndex++) {
            const next = this.nextSprites[nextIndex];
            const nextMinoShape = Data.minoShapes[nextMinos[nextIndex]];
            for (let index = 0; index < nextMinoShape.length; index++) {
                const element = nextMinoShape[index];
                const sprite = next[element[1]][element[0]];
                sprite.tint = Data.blockColor[nextMinos[nextIndex]];
                sprite.visible = true;
            }
        }
    }

    updatePosition() {
        for (let nextIndex = 0; nextIndex < this.nextSprites.length; nextIndex++) {
            const next = this.nextSprites[nextIndex];
            for (let rowIndex = 0; rowIndex < next.length; rowIndex++) {
                const row = next[rowIndex];
                for (let collumnIndex = 0; collumnIndex < row.length; collumnIndex++) {
                    const sprite = row[collumnIndex];
                    sprite.x = this.PC.centerX + this.PC.blockSize * 6 + collumnIndex * this.PC.blockSize;
                    sprite.y = this.PC.centerY - 10 * this.PC.blockSize + this.PC.blockSize * nextIndex * 4 - rowIndex * this.PC.blockSize + this.PC.blockSize;
                    sprite.width = this.PC.blockSize;
                    sprite.height = this.PC.blockSize;
                }
            }
        }
    }

    /**ブロックのテクスチャーを更新する */
    updateBlockTexture() {
        for (let nextIndex = 0; nextIndex < this.nextSprites.length; nextIndex++) {
            const next = this.nextSprites[nextIndex];
            for (let rowIndex = 0; rowIndex < next.length; rowIndex++) {
                const row = next[rowIndex];
                for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                    row[columnIndex].texture = this.PC.blockTexture;
                }
            }
        }
    }
}