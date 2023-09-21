import { Gamemaster } from "./gamemaster";

type iotszlj = 'i' | 'o' | 't' | 's' | 'z' | 'l' | 'j';
type zeroToThree = 0 | 1 | 2 | 3;
type coordinatesArray = [number, number][];

export class Mino {
    /**SRSのデータ */
    static readonly minokick = {
        'jlstz': [
            {
                'clockwise': [[-1, 0], [1, 0], [1, 0], [-1, 0]],
                'counterclockwise': [[1, 0], [1, 0], [-1, 0], [-1, 0]]
            },
            {
                'clockwise': [[-1, 1], [1, -1], [1, 1], [-1, -1]],
                'counterclockwise': [[1, 1], [1, -1], [-1, 1], [-1, -1]]
            },
            {
                'clockwise': [[0, -2], [0, 2], [0, -2], [0, 2]],
                'counterclockwise': [[0, -2], [0, 2], [0, -2], [0, 2]]
            },
            {
                'clockwise': [[-1, -2], [1, 2], [1, -2], [-1, 2]],
                'counterclockwise': [[1, -2], [1, 2], [-1, -2], [-1, 2]]
            }
        ],
        'i': [
            {
                'clockwise': [[-2, 0], [-1, 0], [2, 0], [1, 0]],
                'counterclockwise': [[-1, 0], [2, 0], [1, 0], [-2, 0]]
            },
            {
                'clockwise': [[1, 0], [2, 0], [-1, 0], [-1, 0]],
                'counterclockwise': [[2, 0], [-1, 0], [-2, 0], [1, 0]]
            },
            {
                'clockwise': [[-2, -1], [-1, 2], [2, 1], [1, -2]],
                'counterclockwise': [[-1, 2], [2, 1], [1, -2], [-2, -1]]
            },
            {
                'clockwise': [[1, 2], [2, -1], [-1, -2], [-2, 1]],
                'counterclockwise': [[2, -1], [-1, -2], [-2, 1], [1, 2]]
            }
        ]
    };

    /**Iミノの回転 */
    static readonly iMinoShapes = [
        [[-1, 0], [0, 0], [1, 0], [2, 0]],
        [[1, 1], [1, 0], [1, -1], [1, -2]],
        [[-1, -1], [0, -1], [1, -1], [2, -1]],
        [[0, 1], [0, 0], [0, -1], [0, -2]]
    ];

    /**Gamemaster */
    GM: Gamemaster;
    /**ミノの種類 */
    minoType: iotszlj;

    /**Iミノの回転をコピーして取得する関数 */
    static getIMinoShapes(direction: zeroToThree): coordinatesArray {
        return JSON.parse(JSON.stringify(this.iMinoShapes[direction]));
    }

    /**ミノの原点のx座標 */
    x: number = 0;
    /**ミノの原点のy座標 */
    y: number = 0;
    /**ミノの向き */
    minoDirection: zeroToThree = 0;
    /**ミノの原点からブロックまでの距離 */
    blocksCoordinates: coordinatesArray = [[0, 0], [0, 0], [0, 0], [0, 0]];
    /**固定されたかどうか */
    locked: boolean = false;

    /**T-Spinしているか */
    tspin: boolean = false;
    /**T-Spin Miniかどうか */
    tspinMini: boolean = false;

    get myPosition() {
        return this.blocksCoordinates.map((a): [number, number] => [a[0] + this.x, a[1] + this.y]);
    }

    constructor(minoType: iotszlj, gamemaster: Gamemaster) {

        this.minoType = minoType;
        this.GM = gamemaster;

        // ミノの種類によってブロックの形を決定する
        switch (minoType) {
            case 'i':
                this.x = 4;
                this.y = 20;
                this.blocksCoordinates = Mino.getIMinoShapes(this.minoDirection);
                break;
            case 'o':
                this.x = 4;
                this.y = 21;
                this.blocksCoordinates = [
                    [0, 0], [1, 0],
                    [0, -1], [1, -1]
                ];
                break;
            case 't':
                this.x = 4;
                this.y = 20;
                this.blocksCoordinates = [
                    [0, 1],
                    [-1, 0], [0, 0], [1, 0]
                ];
                break;
            case 's':
                this.x = 4;
                this.y = 20;
                this.blocksCoordinates = [
                    [1, 1], [0, 1],
                    [-1, 0], [0, 0]
                ];
                break;
            case 'z':
                this.x = 4;
                this.y = 20;
                this.blocksCoordinates = [
                    [-1, 1], [0, 1],
                    [0, 0], [1, 0]
                ];
                break;
            case 'l':
                this.x = 4;
                this.y = 20;
                this.blocksCoordinates = [
                    [1, 1],
                    [-1, 0], [0, 0], [1, 0]
                ];
                break;
            case 'j':
                this.x = 4;
                this.y = 20;
                this.blocksCoordinates = [
                    [-1, 1],
                    [-1, 0], [0, 0], [1, 0]
                ];
                break;
        }
    }

    /**SRSを適用する */
    useSRS(blocksCoordinates: coordinatesArray, minoType: iotszlj, currentMinoDirection: zeroToThree, rotateDirection: 'clockwise' | 'counterclockwise', SRSCount: number) {
        // ブロックの座標の配列をコピー
        const newBlocksCoordinates = JSON.parse(JSON.stringify(blocksCoordinates));
        // コピーした配列にSRSを適用
        if (minoType === 'i') {
            for (let i = 0; i < newBlocksCoordinates.length; i++) {
                const e = newBlocksCoordinates[i];
                const SRSData = Mino.minokick.i[SRSCount][rotateDirection][currentMinoDirection];
                e[0] += SRSData[0];
                e[1] += SRSData[1];
            }
        } else {
            for (let i = 0; i < newBlocksCoordinates.length; i++) {
                const e = newBlocksCoordinates[i];
                const SRSData = Mino.minokick.jlstz[SRSCount][rotateDirection][currentMinoDirection];
                e[0] += SRSData[0];
                e[1] += SRSData[1];
            }
        }
        return newBlocksCoordinates;
    }

    /**ミノを回転させる */
    rotate(rotateDirection: 'clockwise' | 'counterclockwise') {
        /**新しいミノの向き */
        let newDirection: zeroToThree;

        let directionTest = this.minoDirection + (rotateDirection === 'clockwise' ? 1 : -1);
        if (directionTest > 3) {
            newDirection = 0;
        } else if (directionTest < 0) {
            newDirection = 3;
        } else if (directionTest === 3) {
            newDirection = 3;
        } else if (directionTest === 2) {
            newDirection = 2;
        } else if (directionTest === 1) {
            newDirection = 1;
        } else {
            newDirection = 0;
        }

        // 新しいミノのブロックの絶対座標の決定
        let newAbsoluteCoordinates: coordinatesArray = [[0, 0], [0, 0], [0, 0], [0, 0]];

        switch (this.minoType) {
            case 'i':
                newAbsoluteCoordinates = Mino.getIMinoShapes(newDirection).map((a): [number, number] => [this.x + a[0], this.y + a[1]]);
                break;
            case 'o':
                newAbsoluteCoordinates = this.blocksCoordinates.map((a): [number, number] => [this.x + a[0], this.y + a[1]]);
                break;
            default:
                if (rotateDirection === 'clockwise') {
                    for (let i = 0; i < this.blocksCoordinates.length; i++) {
                        const e = this.blocksCoordinates[i];
                        newAbsoluteCoordinates[i][0] = e[1] + this.x;
                        newAbsoluteCoordinates[i][1] = -e[0] + this.y;
                    }
                } else {
                    for (let i = 0; i < this.blocksCoordinates.length; i++) {
                        const e = this.blocksCoordinates[i];
                        newAbsoluteCoordinates[i][0] = -e[1] + this.x;
                        newAbsoluteCoordinates[i][1] = e[0] + this.y;
                    }
                }
                break;
        }
        // もともとあったブロックと重なっていないかの確認

        /**SRSテストの回数 */
        let SRSCount = 0;
        let SRSAbsoluteCoordinates: coordinatesArray = newAbsoluteCoordinates;
        while (SRSCount < 4 && this.GM.findOverlapingBlocks(SRSAbsoluteCoordinates)) {
            // 重なっていた時(SRSを使用)
            SRSAbsoluteCoordinates = this.useSRS(newAbsoluteCoordinates, this.minoType, this.minoDirection, rotateDirection, SRSCount);
            SRSCount++;
        }

        if (!this.GM.findOverlapingBlocks(SRSAbsoluteCoordinates)) {
            // 回転成功
            this.minoDirection = newDirection;
            this.x = this.x + SRSAbsoluteCoordinates[0][0] - newAbsoluteCoordinates[0][0];
            this.y = this.y + SRSAbsoluteCoordinates[0][1] - newAbsoluteCoordinates[0][1];

            // T-Spinのリセット
            this.tspin = false;
            this.tspinMini = false;

            //T-Spin判定
            if (this.minoType === 't') {

                let isTspin = 0;
                // Tミノの原点から見て斜めの位置にあるブロックの数を調べる
                if (this.GM.isBlock(this.x - 1, this.y - 1)) {
                    isTspin++;
                }
                if (this.GM.isBlock(this.x + 1, this.y - 1)) {
                    isTspin++;
                }
                if (this.GM.isBlock(this.x + 1, this.y + 1)) {
                    isTspin++;
                }
                if (this.GM.isBlock(this.x - 1, this.y + 1)) {
                    isTspin++;
                }
                // 回転したとき、Tミノの原点から見て斜めの位置にブロックが3つ以上ある時、T-spinになる
                /*
                T-Spinの例(#がブロック、tがTミノ、-は何もないスペース):
                    #--
                    ttt
                    #t#
                    (tミノの真ん中のブロックからみて斜めの位置にブロックが3つある)
                T-Spin失敗の例:
                    -t-
                    #tt
                    #t#
                    (tミノの真ん中のブロックからみて斜めの位置にブロックが2つしかない)
                */
                if (2 < isTspin) {
                    this.tspin = true;
                } else {
                    this.tspin = false;
                }

                // T-Spin Miniの判定
                /*
                T-Spinした時、Tミノの出っ張っているところの隣の2つのマス(下の図の#の場所)
                    ---
                    ttt
                    #t#
                のうちの1つがブロックで埋まっていない場合、T-Spin Miniとなる。
                (ただし、SRSの最後のパターンで入った場合はMiniにならない)
                T-Spin Miniの例:
                    #t-
                    #tt
                    #t#
                */
                if (this.tspin && SRSCount !== 4) {
                    if (this.minoDirection === 0) {
                        // 上に凸の時
                        if (!this.GM.isBlock(this.x - 1, this.y + 1) || !this.GM.isBlock(this.x + 1, this.y + 1)) {
                            this.tspinMini = true;
                        }
                    } else if (this.minoDirection === 1) {
                        // 右に凸の時
                        if (!this.GM.isBlock(this.x + 1, this.y + 1) || !this.GM.isBlock(this.x + 1, this.y - 1)) {
                            this.tspinMini = true;
                        }
                    } else if (this.minoDirection === 2) {
                        // 下に凸の時
                        if (!this.GM.isBlock(this.x - 1, this.y - 1) || !this.GM.isBlock(this.x + 1, this.y - 1)) {
                            this.tspinMini = true;
                        }
                    } else if (this.minoDirection === 3) {
                        // 左に凸の時
                        if (!this.GM.isBlock(this.x - 1, this.y + 1) || !this.GM.isBlock(this.x - 1, this.y - 1)) {
                            this.tspinMini = true;
                        }
                    }
                }
            }
            return true;
        } else {
            // 回転失敗
            return false;
        }
    }

    /**左右移動 */
    moveHorizontally(moveDirection: 'counterclockwise' | 'clockwise') {
        // 右はx座標を+1、左はx座標を-1する
        const newX = this.x + (moveDirection === 'counterclockwise' ? -1 : 1);

        // もともとあったブロックとかぶっていないかチェック
        if (this.testMoving(newX, this.y)) {
            // 移動成功
            this.x = newX;

            // T-Spinのリセット
            this.tspin = false;
            this.tspinMini = false;

            return true;
        } else {
            // 移動失敗
            return false;
        }
    }

    /**ソフトドロップ */
    softdrop() {
        // もともとあったブロックとかぶっていないかチェック
        if (this.softDroppable) {
            // 移動成功
            this.y--;

            // T-Spinのリセット
            this.tspin = false;
            this.tspinMini = false;

            // スコアを加算
            this.GM.increaseScore(this.GM.scoreList.softdrop);

            return true;
        } else {
            // 移動失敗
            return false;
        }
    }

    /**ハードドロップ */
    harddrop() {
        let condition = true;
        while (condition) {
            condition = this.softdrop();
        }

        return true;
    }

    /**引数のミノ座標から絶対座標の配列を作成 */
    getAbsoluteCoordinates(x: number, y: number) {
        const absoluteCoordinates: coordinatesArray = [[0, 0], [0, 0], [0, 0], [0, 0]];
        for (let i = 0; i < this.blocksCoordinates.length; i++) {
            absoluteCoordinates[i][0] = x + this.blocksCoordinates[i][0];
            absoluteCoordinates[i][1] = y + this.blocksCoordinates[i][1];
        }
        return absoluteCoordinates;
    }

    /**引数のミノ座標に移動できるかテストする */
    testMoving(x: number, y: number) {
        // テストするミノの位置
        const testAbsoluteCoordinates = this.getAbsoluteCoordinates(x, y);

        // もともとあったブロックとかぶっていないかチェック
        if (!this.GM.findOverlapingBlocks(testAbsoluteCoordinates)) {
            // 成功
            return true;
        } else {
            // 失敗
            return false;
        }
    }

    /**ソフトドロップ可能か調べる */
    get softDroppable() {
        return this.testMoving(this.x, this.y - 1);
    }

    /**ミノの影の座標を取得 */
    get shadowPosition() {
        let shadowY = this.y - 1;
        while (this.testMoving(this.x, shadowY)) {
            shadowY--;
        }

        return this.getAbsoluteCoordinates(this.x, shadowY);
    }
}