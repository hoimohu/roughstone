import * as PIXI from 'pixi.js';
import * as Data from './data';
import { Gamemaster } from '../tetris/gamemaster';
import { BoardContainer } from './boardContainer';
import { NextContainer } from './nextContainer';
import { HoldContainer } from './holdContainer';

type playerContainerOptions = {
    visibleNextCount: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
    blockSizeRate: number,
    blockTexture: PIXI.Texture,
    shadowTexture: PIXI.Texture,
    frameTexture: PIXI.Texture
};

export class PlayerContainer {
    /**Window */
    window: Window;
    /**Gamemaster */
    GM: Gamemaster;

    /**描画上の盤面の中心のx */
    centerX: number;
    /**描画上の盤面の中心のy */
    centerY: number;
    /**描画上の盤面の中心のxを幅の割合で指定 */
    centerXRate: number;
    /**描画上の盤面の中心のyを幅の割合で指定 */
    centerYRate: number;

    /**コンテナ */
    container = new PIXI.Container();
    /**盤面のコンテナ */
    boardContainer: BoardContainer;
    /**ネクストのコンテナ */
    nextContainer: NextContainer;
    /**ホールドのコンテナ */
    holdContainer: HoldContainer;

    /**スコアのスプライト */
    scoreSprite = new PIXI.Text('000000000000', { fontFamily: "sans-serif", fontSize: 20, fill: 0xffffff, stroke: 0x000000, strokeThickness: 6 });
    /**裏のフレームのスプライト */
    frameSprite: PIXI.Sprite;

    /**ブロックのサイズの画面の縦幅に対する割合 */
    blockSizeRate: number;
    /**ブロックのサイズ */
    blockSize: number;
    /**ネクスト・ホールドのブロックのサイズのblockSizeに対する割合 */
    nextAndHoldSizeRate: number = 1 / 4 * 3;

    /**ブロックのテクスチャー */
    blockTexture: PIXI.Texture;
    /**ミノの影のテクスチャー */
    shadowTexture: PIXI.Texture;
    /**裏のフレームのテクスチャー */
    frameTexture: PIXI.Texture;

    constructor(window: Window, gamemaster: Gamemaster, centerXRate: number, centerYRate: number,
        options: playerContainerOptions = {
            visibleNextCount: 5,
            blockSizeRate: 1 / 30,
            blockTexture: Data.blockTextures.bright,
            shadowTexture: Data.shadowTextures.roughstone,
            frameTexture: Data.frameTextures.luxury
        }) {
        this.window = window;
        this.GM = gamemaster;
        this.centerXRate = centerXRate;
        this.centerYRate = centerYRate;
        this.centerX = this.window.innerWidth * this.centerXRate;
        this.centerY = this.window.innerHeight * this.centerYRate;
        this.blockSizeRate = options.blockSizeRate;
        this.blockTexture = options.blockTexture;
        this.shadowTexture = options.shadowTexture;
        this.frameTexture = options.frameTexture;

        this.blockSize = this.window.innerHeight * this.blockSizeRate;

        this.scoreSprite.style.fontSize = this.blockSize;
        this.scoreSprite.anchor.set(1, 0);

        this.boardContainer = new BoardContainer(this);
        this.nextContainer = new NextContainer(this, options.visibleNextCount);
        this.holdContainer = new HoldContainer(this);

        this.frameSprite = new PIXI.Sprite(this.frameTexture);
        this.frameSprite.anchor.set(0.5);

        this.container.addChild(this.frameSprite, this.boardContainer.container, this.nextContainer.container, this.holdContainer.container, this.scoreSprite);

        window.addEventListener('resize', () => this.onResize());
        this.onResize();
    }

    render() {
        this.boardContainer.render();
        this.nextContainer.render();
        this.holdContainer.render();

        if (this.GM.score < 1000000000000) {
            this.scoreSprite.text = ('000000000000' + this.GM.score).slice(-12);
        } else {
            this.scoreSprite.style.fill = 0xFFA500;
            this.scoreSprite.text = this.GM.score;
        }
    }

    onResize() {
        this.centerX = this.window.innerWidth * this.centerXRate;
        this.centerY = this.window.innerHeight * this.centerYRate;
        this.blockSize = this.window.innerHeight * this.blockSizeRate;
        this.boardContainer.updatePosition();
        this.nextContainer.updatePosition();
        this.holdContainer.updatePosition();

        this.frameSprite.position.set(this.centerX, this.centerY);
        this.frameSprite.width = this.window.innerHeight / 10 * 9 / 942 * 654;
        this.frameSprite.height = this.blockSize * 28;

        this.scoreSprite.x = this.centerX + this.blockSize * 5;
        this.scoreSprite.y = this.centerY + this.blockSize * 11;

    }
}