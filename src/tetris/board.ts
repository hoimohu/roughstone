type coordinatesArray = [number, number][];

export class Board {

    /**盤面の横幅 */
    readonly width: number = 10;
    /**盤面の高さ */
    readonly height: number = 40;

    /**盤面データ */
    board: string[][];

    constructor() {
        // 盤面の配列の作成
        const newBoardData: string[][] = [];
        for (let rowCount = 0; rowCount < this.height; rowCount++) {
            const newRow: string[] = [];
            for (let columnCount = 0; columnCount < this.width; columnCount++) {
                newRow.push('');
            }
            newBoardData.push(newRow);
        }
        this.board = newBoardData;
    }

    /**引数の座標にブロックが存在するか調べる */
    isBlock(x: number, y: number) {
        if (x < 0 || y < 0 || this.width <= x || this.height <= y) {
            // 検証する座標が盤面外だった場合
            return true;
        } else if (this.board[y][x] !== '') {
            // 検証する座標にブロックがあった場合
            return true;
        } else {
            // それ以外
            return false;
        }
    }
    
    /**引数の座標にブロックが存在するかを調べる */
    findOverlapingBlocks(blocksCoordinates: coordinatesArray) {
        let result: boolean = false;
        for (let i = 0; i < blocksCoordinates.length; i++) {
            const e = blocksCoordinates[i];
            if (this.isBlock(e[0], e[1])) {
                result = true;
                break;
            }
        }
        return result;
    }

    /**引数の座標にブロックを設置する */
    fill(coordinates: [number,number][], type: string) {
        for (let i = 0; i < coordinates.length; i++) {
            const e = coordinates[i];
            this.board[e[1]][e[0]] = type;
        }
    }
}