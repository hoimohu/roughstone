import { Gamemaster } from "./gamemaster";

export class Control {
    /**
     * ARR: Automatic Repeat Rate  
     * 長押し入力の時の移動の自動入力の間隔(フレーム数)
     */
    ARR: number;
    /**
     * DAS: Delayed Auto Shift  
     * ARRに入るまでの時間(フレーム数)
     */
    DAS: number;
    /**
     * DCD: DAS Cut Delay  
     * 新しいミノの先行入力にかかる時間(フレーム数)
     */
    DCD: number;
    /**
     * SDF: Soft Drop Factor  
     * ソフトドロップが通常の何倍の速さで動くか(フレーム数)
     */
    SDF: number;

    /**右入力中 */
    pressingRight: boolean = false;
    /**左入力中 */
    pressingLeft: boolean = false;
    /**下入力中 */
    pressingDown: boolean = false;

    /**待機時間 */
    waitFrames: number = 0;

    /**自由落下の間隔(フレーム数) */
    freeFall: number = 60;
    /**ロックダウンまでの時間(フレーム数) */
    lockDownTimer: number = 30;
    /**ロックダウン待機中かどうか */
    waitinglockDown: boolean = false;
    /**強制ロックダウンまでの動ける回数 */
    lockDownCount: number = 15;
    /**現在のミノの最低高度 */
    currentLowestHeight: number = 0;

    /**水平移動の方向 */
    moveDirection: 'left' | 'right' | 'idle' = 'idle';

    /**残りのDAS */
    remainingDAS: number;
    /**残りのARR */
    remainingARR: number;
    /**残りのDCD */
    remainingDCD: number;
    /**残りのFreeFall */
    remainingFreeFall: number;
    /**残りのlockDownCount */
    remaininglockDownCount: number;

    /**Gamemaster */
    GM: Gamemaster;

    constructor(ARR: number, DAS: number, DCD: number, SDF: number, gamemaster: Gamemaster) {
        this.ARR = ARR;
        this.DAS = DAS;
        this.DCD = DCD;
        this.SDF = SDF;

        this.remainingDAS = this.DAS;
        this.remainingARR = this.ARR;
        this.remainingDCD = 0;
        this.remainingFreeFall = this.freeFall;
        this.remaininglockDownCount = this.lockDownCount;
        this.waitinglockDown = false;

        this.GM = gamemaster;
    }

    /**操作制御の自動ループ */
    controlLoop() {
        // requestAnimationFrameで実行
        requestAnimationFrame(() => {
            this.loopFunction();
            this.controlLoop();
        });
    }

    /**操作制御のループ関数（ここをループするべし） */
    loopFunction() {
        if (this.GM.gameRunning && !this.GM.currentMino.locked) {
            if (0 < this.waitFrames) {
                this.waitFrames--;
                this.remainingDAS--;
            } else {
                this.GM.currentMino.visible = true;
                if (this.pressingRight || this.pressingLeft) {
                    // 動かす向きの判定
                    if (this.pressingRight && !this.pressingLeft && this.moveDirection !== 'right') {
                        this.moveDirection = 'right';
                        this.moveMinoHorizontally();
                    } else if (!this.pressingRight && this.pressingLeft && this.moveDirection !== 'left') {
                        this.moveDirection = 'left';
                        this.moveMinoHorizontally();
                    }
                    if (0 < this.remainingDCD) {
                        // まずDCDを消費
                        this.remainingDCD--;
                    } else if (0 < this.remainingDAS) {
                        // 次にDADを消費
                        this.remainingDAS--;
                    } else {
                        // 最後にARRを使用
                        if (0 < this.remainingARR) {
                            this.remainingARR--;
                        } else {
                            // ARR移動(早く移動するやつ)
                            this.moveMinoHorizontally();
                            this.remainingARR = this.ARR;
                        }
                    }
                } else {
                    // それぞれの値をリセット
                    this.remainingDAS = this.DAS;
                    this.remainingARR = this.ARR;

                    this.moveDirection = 'idle';
                }
                // ソフトドロップ
                if (this.pressingDown && !this.waitinglockDown) {
                    this.remainingFreeFall -= this.SDF;
                } else {
                    this.remainingFreeFall--;
                }
                if (this.remainingFreeFall <= 0) {
                    // ソフトドロップする
                    const condition = this.GM.currentMino.softdrop(this.pressingDown);
                    if (condition) {
                        // ソフトドロップ成功
                        if (this.GM.currentMino.softDroppable) {
                            // 地面すれすれじゃないなら、自由落下タイマーをリセット
                            this.remainingFreeFall = this.freeFall;
                            this.waitinglockDown = false;
                        } else {

                            // 地面すれすれ状態なら
                            if (this.remaininglockDownCount <= 0) {
                                // 強制設置
                                this.lockAndNextTurn();
                            } else {
                                // 自由落下タイマーを lockDownTimer の値にする
                                this.remainingFreeFall = this.lockDownTimer;
                                this.waitinglockDown = true;
                            }
                        }
                        if (this.GM.currentMino.y < this.currentLowestHeight) {
                            // 最低高度を更新したとき
                            this.currentLowestHeight = this.GM.currentMino.y;
                            this.remaininglockDownCount = this.lockDownCount;
                        }

                        this.GM.event({
                            type: 'softdrop',
                            pressingDown: this.pressingDown
                        });
                    } else {
                        // ソフトドロップ失敗なら設置
                        this.lockAndNextTurn();
                    }
                }
            }
            this.GM.controlLoopedCount++;
        }
    }

    /**次のターンへ */
    lockAndNextTurn() {
        if (this.GM.gameRunning) {
            this.minoChange();

            this.GM.turn.nextTurn();
        }
    }

    /**動かすミノが変わったとき（設置時とホールド時） */
    minoChange() {
        if (this.GM.gameRunning) {
            this.remainingARR = this.ARR;
            this.remainingDCD = this.DCD;
            this.remainingFreeFall = this.freeFall;
            this.remaininglockDownCount = this.lockDownCount;
            this.waitinglockDown = false;
        }
    }

    /**ミノを moveDirection の方向に動かす */
    moveMinoHorizontally() {
        if (this.GM.gameRunning && this.waitFrames <= 0) {
            if (this.moveDirection !== 'idle') {
                const condition = this.GM.currentMino.moveHorizontally(this.moveDirection);
                if (condition) {
                    // 移動成功
                    this.remaininglockDownCount--;

                    if (!this.GM.currentMino.softDroppable) {
                        // 地面すれすれ状態なら、自由落下タイマーを lockDownTimer の値にする
                        if (0 < this.remaininglockDownCount) {
                            this.remainingFreeFall = this.lockDownTimer;
                        }
                        this.waitinglockDown = true;
                    } else {
                        this.waitinglockDown = false;
                    }

                    this.GM.event({
                        type: 'move',
                        direction: this.moveDirection
                    });
                }
            }
        }
    }

    /**右回転 */
    rotateClockwise() {
        if (this.GM.gameRunning && this.waitFrames <= 0) {
            const condition = this.GM.currentMino.rotate('clockwise');
            if (condition) {
                // 回転成功
                this.remaininglockDownCount--;

                if (!this.GM.currentMino.softDroppable) {
                    // 地面すれすれ状態なら、自由落下タイマーを lockDownTimer の値にする
                    if (0 < this.remaininglockDownCount) {
                        this.remainingFreeFall = this.lockDownTimer;
                    }
                    this.waitinglockDown = true;
                } else {
                    this.waitinglockDown = false;
                }

                this.GM.event({
                    type: 'rotate',
                    direction: 'clockwise'
                });
            }
        }
    }
    /**左回転 */
    rotateCounterclockwise() {
        if (this.GM.gameRunning && this.waitFrames <= 0) {
            const condition = this.GM.currentMino.rotate('counterclockwise');
            if (condition) {
                // 回転成功
                this.remaininglockDownCount--;

                if (!this.GM.currentMino.softDroppable) {
                    // 地面すれすれ状態なら、自由落下タイマーを lockDownTimer の値にする
                    if (0 < this.remaininglockDownCount) {
                        this.remainingFreeFall = this.lockDownTimer;
                    }
                    this.waitinglockDown = true;
                } else {
                    this.waitinglockDown = false;
                }

                this.GM.event({
                    type: 'rotate',
                    direction: 'counterclockwise'
                });
            }
        }
    }

    /**ホールドを使う */
    holdKey() {
        if (this.GM.gameRunning && this.waitFrames <= 0) {
            const condition = this.GM.useHold();
            if (condition) {
                this.minoChange();
                this.GM.event({
                    type: 'hold'
                });
            }
        }
    }

    /**ハードドロップの処理 */
    harddropKey() {
        if (this.GM.gameRunning && this.waitFrames <= 0) {
            this.remainingDCD = this.DCD;
            this.GM.currentMino.harddrop();

            this.GM.event({
                type: 'harddrop'
            });

            this.lockAndNextTurn();
        }
    }

    // その他移動系
    rightKeyDown() {
        if (this.GM.gameRunning) {
            this.pressingRight = true;
            const movingDirection = this.moveDirection;
            this.moveDirection = 'right';
            if (movingDirection === 'idle' || movingDirection === 'left') {
                this.moveMinoHorizontally();
            }
            if (movingDirection !== 'idle') {
                this.remainingDAS = this.DAS;
            }
        }
    }
    rightKeyUp() {
        if (this.GM.gameRunning) {
            this.pressingRight = false;
        }
    }
    leftKeyDown() {
        if (this.GM.gameRunning) {
            this.pressingLeft = true;
            const movingDirection = this.moveDirection;
            this.moveDirection = 'left';
            if (movingDirection === 'idle' || movingDirection === 'right') {
                this.moveMinoHorizontally();
            }
            if (movingDirection !== 'idle') {
                this.remainingDAS = this.DAS;
            }
        }
    }
    leftKeyUp() {
        if (this.GM.gameRunning) {
            this.pressingLeft = false;
        }
    }
    downKeyDown() {
        if (this.GM.gameRunning) {
            this.pressingDown = true;
        }
    }
    downKeyUp() {
        if (this.GM.gameRunning) {
            this.pressingDown = false;
        }
    }
}