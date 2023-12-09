import { Board } from "./board";
import { Control } from "./control";
import { Mino } from "./mino";
import { Turn } from "./turn";


type iotszlj = 'i' | 'o' | 't' | 's' | 'z' | 'l' | 'j';

type event_softdrop = {
    type: 'softdrop',
    pressingDown: boolean
};
type event_move = {
    type: 'move',
    direction: 'left' | 'right'
};
type event_rotate = {
    type: 'rotate',
    direction: 'clockwise' | 'counterclockwise'
};
type event_hold = {
    type: 'hold'
};
type event_harddrop = {
    type: 'harddrop'
};
type event_nextTurn = {
    type: 'nextTurn',
    clearedLinesCount: number,
    attack: number,
    perfectClear: boolean,
    tSpin: boolean,
    tSpinMini: boolean,
    ren: number,
    backToBack: boolean,
    pushedBlockCount: number
};
type event_gameover = {
    type: 'gameover'
};
type event_all = event_softdrop | event_move | event_rotate | event_hold | event_harddrop | event_nextTurn | event_gameover;

type eventListeners = {
    move: Function[],
    rotate: Function[],
    hold: Function[],
    harddrop: Function[],
    nextTurn: Function[],
    all: Function[]
};
type eventListnerType = 'move' | 'rotate' | 'hold' | 'harddrop' | 'nextTurn' | 'all';


/**中央制御 */
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
    /**スタートした時間 */
    startTime: number = 0;
    /** controlLoop が実行された回数 */
    controlLoopedCount: number = 0;

    /**スコア */
    score: number = 0;
    /**消したライン数 */
    clearedLines: number = 0;

    /**現在のREN数 */
    ren: number = 0;
    /**Back to Backかどうか */
    backToBack: boolean = false;

    /**現在のミノ*/
    currentMino: Mino;
    /**ホールドにあるミノ*/
    holdMino: iotszlj | 'none' = 'none';
    /**前回ホールドを使って出したミノ */
    previousMinoByHold: Mino = new Mino('t', this);

    /**ダメージ */
    damageAmountArray: number[] = [];

    /**操作制御 */
    control: Control;

    /**ターン管理 */
    turn = new Turn(this);

    /**event関数に来たobject */
    eventMessage: object = {};

    eventListeners: eventListeners = {
        move: [],
        rotate: [],
        hold: [],
        harddrop: [],
        nextTurn: [],
        all: []
    };

    /**
     * ゲームの初期化
     * @param controlLoop 自動Loopを有効にする（初期値:true）
     * @param ARR ARRの値（初期値:1）
     * @param DAS DASの値（初期値:8）
     * @param DCD DCDの値（初期値:2）
     * @param SDF SDFの値（初期値:30）
     */
    constructor(controlLoop: boolean = true, ARR: number = 1, DAS: number = 8, DCD: number = 2, SDF: number = 30) {
        super();

        // 操作クラスのインスタンスを作成
        this.control = new Control(ARR, DAS, DCD, SDF, this);

        // 一応、最初のミノをセット
        this.currentMino = this.createMino(this.turn.nextMinos[0]);

        if (controlLoop) {
            // ループ開始
            this.control.controlLoop();
        }
    }

    /**引数のタイプのMinoインスタンスを作成 */
    createMino(type: iotszlj) {
        return new Mino(type, this);
    }

    /** currentMino を変える */
    changeCurrentMino(newMino: Mino) {
        this.currentMino = newMino;
        this.control.currentLowestHeight = newMino.y;
    }


    /**ホールド動作を行う */
    useHold() {
        if (this.previousMinoByHold !== this.currentMino && this.gameRunning) {
            // ホールドを使用
            const previousHoldMino = this.holdMino;
            this.holdMino = this.currentMino.minoType;
            let createdMino: Mino;

            if (previousHoldMino === 'none') {
                createdMino = this.createMino(this.turn.shiftNext());
            } else {
                createdMino = this.createMino(previousHoldMino);
            }
            this.changeCurrentMino(createdMino);
            this.previousMinoByHold = createdMino;

            // ゲームオーバー判定
            if (this.findOverlapingBlocks(createdMino.myPosition)) {
                // 次のミノが最初からブロックに埋まっていて、なおかつy+1しても埋まっていたらゲームオーバー
                createdMino.y++;
                if (this.findOverlapingBlocks(createdMino.myPosition)) {
                    this.gameover();

                    // 失敗
                    return false;
                }
            }

            // 成功
            return true;
        } else {
            // ホールドを使って出したミノがまだ動かせるとき失敗
            return false;
        }
    }

    /**ゲームを開始 */
    start() {
        if (this.startTime === 0) {
            this.startTime = Date.now();
            this.changeCurrentMino(this.createMino(this.turn.shiftNext()));

            this.gameRunning = true;
        }
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
            this.event({
                type: 'gameover'
            });
        }
    }

    /**
     * スコアを増やす
     * @param score スコア増加分
     */
    increaseScore(score: number) {
        if (this.gameRunning) {
            this.score += score;
        }
    }


    /**何か起こったときの関数 */
    event(event: event_all) {
        this.eventMessage = event;
        switch (event.type) {
            case 'harddrop': {
                const array = this.eventListeners.harddrop;
                for (let index = 0; index < array.length; index++) {
                    array[index](event);
                }
            }
            case 'softdrop':
            case 'move': {
                const array = this.eventListeners.move;
                for (let index = 0; index < array.length; index++) {
                    array[index](event);
                }
                break;
            }
            case 'rotate': {
                const array = this.eventListeners.rotate;
                for (let index = 0; index < array.length; index++) {
                    array[index](event);
                }
                break;
            }
            case 'hold': {
                const array = this.eventListeners.hold;
                for (let index = 0; index < array.length; index++) {
                    array[index](event);
                }
                break;
            }
            case 'nextTurn': {
                const array = this.eventListeners.nextTurn;
                for (let index = 0; index < array.length; index++) {
                    array[index](event);
                }
                break;
            }
        }
        const array = this.eventListeners.all;
        for (let index = 0; index < array.length; index++) {
            array[index](event);
        }
    }
    /**イベントリスナーの追加 */
    addEventListener(type: eventListnerType, eventFunction: (e: event_all) => any) {
        this.eventListeners[type].push(eventFunction);
    }
}