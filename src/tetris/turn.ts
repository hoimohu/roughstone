import { Gamemaster } from "./gamemaster";
import { Bag } from "./bag";

export class Turn extends Bag {
    /**Gamemaster */
    GM: Gamemaster;

    constructor(gamemaster: Gamemaster) {
        super();
        this.GM = gamemaster;
    }

    nextTurn() {
        // 盤面にミノを設置する
        this.GM.fill(this.GM.currentMino.myPosition, this.GM.currentMino.minoType);
        this.GM.currentMino.locked = true;
        this.GM.currentMino.visible = false;

        // ゲームオーバー判定 その1
        if (!this.GM.currentMino.myPosition.some(a => a[1] < 20)) {
            // 1. 完全に画面外ミノを置いた場合はゲームオーバー
            this.GM.gameover();

            // ゲームオーバーなのでここまで
            return false;
        }

        /**消したラインの数 */
        let clearedLinesCount = 0;
        for (let i = 0; i < this.GM.board.length; i++) {
            const e = this.GM.board[i];
            if (!e.some(v => v === '')) {
                clearedLinesCount++;

                // 消す分だけ盤面配列に新しい列を挿入
                const newRow: string[] = [];
                for (let columnCount = 0; columnCount < this.GM.width; columnCount++) {
                    newRow.push('');
                }
                this.GM.board.push(newRow);
            }
        }
        // 埋まっている列を消す
        this.GM.board = this.GM.board.filter(a => a.some(v => v === ''));

        // スコアと攻撃力の計算
        /**スコア */
        let score: number = 0;
        /**攻撃 */
        let attack: number = 0;
        /**パーフェクトクリアしているか */
        let perfectClear: boolean = false;
        /**T-Spinかどうか */
        let tSpin: boolean = this.GM.currentMino.tspin;
        /**T-Spin Miniかどうか */
        let tSpinMini: boolean = this.GM.currentMino.tspinMini;
        // 基礎点
        if (tSpin) {
            if (!tSpinMini) {
                switch (clearedLinesCount) {
                    case 0:
                        score += this.GM.scoreList.tspin;
                        break;
                    case 1:
                        score += this.GM.scoreList.tspinSingle;
                        attack = 2;
                        break;
                    case 2:
                        score += this.GM.scoreList.tspinDouble;
                        attack = 4;
                        break;
                    case 3:
                        score += this.GM.scoreList.tspinTriple;
                        attack = 6;
                        break;
                }
            }
        } else {
            switch (clearedLinesCount) {
                case 1:
                    score += this.GM.scoreList.single;
                    break;
                case 2:
                    score += this.GM.scoreList.double;
                    attack = 1;
                    break;
                case 3:
                    score += this.GM.scoreList.triple;
                    attack = 2;
                    break;
                case 4:
                    score += this.GM.scoreList.tetris;
                    attack = 4;
                    break;
            }
        }
        // ren数
        const ren = this.GM.ren;
        // renの点
        const renScore = ren * this.GM.scoreList.renDefault;
        if (this.GM.scoreList.renMax < renScore) {
            score += this.GM.scoreList.renMax;
        } else {
            score += renScore;
        }
        for (let renCount = 0; renCount < this.GM.ren; renCount++) {
            if (10 < renCount) {
                attack += 5;
            } else if (7 < renCount) {
                attack += 4;
            } else if (5 < renCount) {
                attack += 3;
            } else if (3 < renCount) {
                attack += 2;
            } else if (1 < renCount) {
                attack += 1;
            }
        }
        // BtBボーナス
        if (4 <= clearedLinesCount || this.GM.currentMino.tspin) {
            if (this.GM.backToBack) {
                score *= 1.5;
                attack += 1;
            }
            this.GM.backToBack = true;
        } else {
            this.GM.backToBack = false;
        }
        /**Back To Backかどうか */
        const backToBack = this.GM.backToBack;
        // その他のボーナス点
        if (!this.GM.board.some(a => a.join('') !== '')) {
            // パーフェクトクリア
            switch (clearedLinesCount) {
                case 1:
                    score += this.GM.scoreList.perfectClearSingle;
                    break;
                case 2:
                    score += this.GM.scoreList.perfectClearDouble;
                    break;
                case 3:
                    score += this.GM.scoreList.perfectClearTriple;
                    break;
                case 4:
                    score += this.GM.scoreList.perfectClearTetris;
                    break;
            }
            perfectClear = true;
            attack = 10;
        }
        // T-Spin Miniボーナス点
        if (this.GM.currentMino.tspinMini) {
            score += 100;
        }

        // 相殺
        while (0 < attack && 0 < this.GM.damageAmountArray.length) {
            this.GM.damageAmountArray[0] -= attack;
            if (this.GM.damageAmountArray[0] <= 0) {
                attack = -this.GM.damageAmountArray[0];
                this.GM.damageAmountArray.shift();
            } else {
                attack = 0;
            }
        }
        // せり上がり
        /**せりあがったブロック数 */
        let pushedBlockCount: number = 0;
        while (0 < this.GM.damageAmountArray.length) {
            const damage = this.GM.damageAmountArray.shift();
            if (typeof damage === 'number') {
                const holeX = Math.floor(10 * Math.random());
                for (let i = 0; i < damage; i++) {
                    const newRow: string[] = [];
                    for (let columnCount = 0; columnCount < this.GM.width; columnCount++) {
                        newRow.push('d');
                    }
                    newRow[holeX] = '';
                    this.GM.board.unshift(newRow);
                    this.GM.board.pop();

                    pushedBlockCount++;
                }
            }
        }

        // renの継続
        if (0 < clearedLinesCount) {
            this.GM.ren++;
        } else {
            this.GM.ren = 0;
        }

        // 列が消えたときの待機時間
        switch (clearedLinesCount) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.GM.control.waitFrames = 30;
                break;
            default:
                this.GM.control.waitFrames = 1;
                break;
        }
        if (perfectClear) {
            this.GM.control.waitFrames = 1;
        }

        // 次のミノを作成
        const nextMino = this.GM.createMino(this.shiftNext());

        // ゲームオーバー判定 その2
        if (this.GM.findOverlapingBlocks(nextMino.myPosition)) {
            // 2. 次のミノが最初からブロックに埋まっていたらゲームオーバー
            this.GM.gameover();
            return false;
        } else if (this.GM.board[39].join('') !== '') {
            // 3. 下から40段目にブロックがあったらゲームオーバー
            this.GM.gameover();
            return false;
        }

        // 次のミノを出現させる
        this.GM.changeCurrentMino(nextMino);

        this.GM.event({
            type: 'nextTurn',
            clearedLinesCount,
            attack,
            perfectClear,
            tSpin,
            tSpinMini,
            ren,
            backToBack,
            pushedBlockCount
        });

        return true;
    }
}