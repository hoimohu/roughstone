import { Board } from "../tetris/board";


type iotszlj = 'i' | 'o' | 't' | 's' | 'z' | 'l' | 'j';


class createMinoShape {

    shape: string[][];
    width: number;
    height: number;

    constructor(shape: string[][]) {
        this.shape = shape.reverse();
        this.width = shape[0].length;
        this.height = shape.length;
    }
}

/**
 * ' 'ブロックなし
 * '*'この中に一つでもブロックがあればよい
 * '#'ブロック必須
 * '-'ブロックがあってもなくても良い
 * '?'この中が全てブロックでなければよい
 */
const minoData = {
    i:[
        new createMinoShape([
            ['?','?','?','?'],
            [' ',' ',' ',' '],
            ['*','*','*','*']
        ]),
        new createMinoShape([
            [' '],
            [' '],
            [' '],
            [' '],
            ['#']
        ])
    ],
    o:[
        new createMinoShape([
            [' ',' '],
            [' ',' '],
            ['*','*']
        ])
    ],
    t:[
        new createMinoShape([
            ['?',' ','?'],
            [' ',' ',' '],
            ['*','*','*']
        ])
    ],
    s:[],
    z:[],
    l:[],
    j:[],
};

/**
 * ミノが置ける場所を探す
 * @param minoType ミノの種類
 */
function detectPutPositions(minoType: iotszlj) {

}

/**
 * 現在のミノを使った時と、ホールドのミノを使った時を比べる
 * @param boardData 盤面配列
 * @param currntMino 落ちてくるミノ
 * @param holdMino ホールドにあるミノ
 * @param nextMinos ネクストのミノの配列
 */
function compare(boardData: string[][], currntMino: iotszlj, holdMino: iotszlj | 'none', nextMinos: iotszlj[]) {
    let values = [];
    // 今のミノの評価を配列に入れる
    values.push(...evaluate(boardData, currntMino, holdMino, nextMinos));
    // ホールドミノの評価
    if (holdMino === 'none') {
        const newNextMinos = [...nextMinos];
        const newCurrentMino = newNextMinos.shift();
        if (newCurrentMino !== undefined) {
            values.push(evaluate(boardData, newCurrentMino, currntMino, newNextMinos));
        }
    } else {
        values.push(evaluate(boardData, holdMino, currntMino, nextMinos));
    }
}

function evaluate(boardData: string[][], currntMino: iotszlj, holdMino: iotszlj | 'none', nextMinos: iotszlj[]) {
    const testBoard = new Board();
    testBoard.board = boardData.map(a => [...a]);
    return [];
}