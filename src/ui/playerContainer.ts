import * as PIXI from 'pixi.js';
import * as Data from './data';
import { Gamemaster } from '../tetris/gamemaster';
import { BoardContainer } from './boardContainer';
import { NextContainer } from './nextContainer';
import { HoldContainer } from './holdContainer';

export class PlayerContainer {
    /**Window */
    window: Window;
    /**Gamemaster */
    GM: Gamemaster;

    /**描画上の盤面の中心のx */
    centerX: number;
    /**描画上の盤面の中心のy */
    centerY: number;

    /**コンテナ */
    container = new PIXI.Container();
    /**盤面のコンテナ */
    boardContainer: BoardContainer;
    /**ネクストのコンテナ */
    nextContainer: NextContainer;
    /**ホールドのコンテナ */
    holdContainer: HoldContainer;

    /**スコアのスプライト */
    scoreSprite = new PIXI.Text(0, { fontFamily: 'Arial', fontSize: 24, fill: 0xffffff, stroke: 0x000000, align: 'right' });

    /**ブロックのサイズ */
    blockSize: number;

    /**ブロックのテクスチャー */
    blockTexture: PIXI.Texture;
    /**ミノの影のテクスチャー */
    shadowTexture: PIXI.Texture;

    constructor(window: Window, gamemaster: Gamemaster, centerX: number, centerY: number, visibleNextCount: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 5, blockTexture: PIXI.Texture = Data.blockTextures.hydrop, shadowTexture: PIXI.Texture = Data.shadowTextures.roughstone) {
        this.window = window;
        this.GM = gamemaster;
        this.centerX = centerX;
        this.centerY = centerY;
        this.blockTexture = blockTexture;
        this.shadowTexture = shadowTexture;

        this.blockSize = this.window.innerHeight / 25;
        this.scoreSprite.style.fontSize = this.blockSize;
        this.scoreSprite.anchor.set(1, 0);

        this.boardContainer = new BoardContainer(this);
        this.nextContainer = new NextContainer(this, visibleNextCount);
        this.holdContainer = new HoldContainer(this);

        this.container.addChild(this.boardContainer.container, this.nextContainer.container, this.holdContainer.container);

        window.addEventListener('resize', () => this.onResize());
        this.onResize();
    }

    render(){
        this.boardContainer.render();
        this.nextContainer.render();
        this.holdContainer.render();

        this.scoreSprite.text = this.GM.score;
    }

    onResize() {
        this.blockSize = this.window.innerHeight / 25;
        this.boardContainer.updatePosition();
        this.nextContainer.updatePosition();
        this.holdContainer.updatePosition();

        this.scoreSprite.x = this.centerX + this.blockSize * 5;
        this.scoreSprite.y = this.centerY + this.blockSize * 11;
    }
}