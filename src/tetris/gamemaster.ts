import { Board } from "./board";
import { Control } from "./control";
import { Mino } from "./mino";
import { Turn } from "./turn";

type iotszlj = 'i' | 'o' | 't' | 's' | 'z' | 'l' | 'j';

export class Gamemaster extends Board {
    /**スコア一覧 */
    scoreList = {
        // 基礎点
        softdrop: 2,
        single: 100,
        double: 300,
        triple: 500,
        tetris: 800,
        tspin: 400,
        tspinSingle: 800,
        tspinDouble: 1200,
        tspinTriple: 1600,
        renDefault: 50,
        renMax: 1000,
        // ボーナス点
        perfectClearSingle: 800,
        perfectClearDouble: 1000,
        perfectClearTriple: 1800,
        perfectClearTetris: 2000,
        tspinMini: 100,
        // 乗算ボーナス
        backToBack: 1.5
    };

    /**ゲームが動いているかどうか */
    gameRunning: boolean = false;

    /**スコア */
    score: number = 0;
    /**消したライン数 */
    clearedLines: number = 0;

    /**現在のREN数 */
    ren: number = 0;
    /**Back to Backかどうか */
    backToBack: boolean = false;

    /**現在のミノ*/
    availableMino: Mino;
    /**ホールドにあるミノ*/
    holdMino: iotszlj | 'none' = 'none';
    /**前回ホールドを使って出したミノ */
    previousMinoByHold: Mino = new Mino('t', this);

    /**ダメージ */
    damageAmountArray: number[] = [];

    /**操作制御 */
    control = new Control(2, 9, 7, 20, this);

    /**ターン管理 */
    turn = new Turn(this);

    constructor() {
        super();
    }

    /**引数のタイプのMinoインスタンスを作成 */
    createMino(type: iotszlj) {
        return new Mino(type, this);
    }

    /** availableMino を変える */
    changeAvailableMino(newMino: Mino) {
        this.availableMino = newMino;
        this.control.currentLowestHeight = newMino.y;
    }


    /**ホールド動作を行う */
    useHold() {
        if (this.previousMinoByHold === this.availableMino && this.gameRunning) {
            // ホールドを使用
            const previousHoldMino = this.holdMino;
            this.holdMino = this.availableMino.minoType;
            let createdMino: Mino;

            if (previousHoldMino === 'none') {
                createdMino = this.createMino(this.turn.shiftNext());
            } else {
                createdMino = this.createMino(previousHoldMino);
            }
            this.changeAvailableMino(createdMino);
            this.previousMinoByHold = createdMino;

            // 成功
            return true;
        } else {
            // ホールドを使って出したミノがまだ動かせるとき失敗
            return false;
        }
    }

    /**ゲームを開始 */
    start() {
        this.gameRunning = true;

        this.changeAvailableMino(this.createMino(this.turn.shiftNext()));
    }

    /**一時停止 */
    pause() {
        this.gameRunning = false;
    }

    /**再開 */
    unpause() {
        this.gameRunning = true;
    }

    /**ゲームオーバーになったとき */
    gameover() {
        if (this.gameRunning) {
            this.gameRunning = false;
        }
    }

    /**スコアを増やす */
    increaseScore(score: number) {
        if (this.gameRunning) {
            this.score += score;
        }
    }


    /**ゲームの装飾用関数 */
    event(event: object) { }
}