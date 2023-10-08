import * as PIXI from 'pixi.js';
/**各ミノの形 */
export const minoShapes: { [key: string]: [number, number][] } = {
    i: [[0, 0], [1, 0], [2, 0], [3, 0]],
    o: [[1, 0], [2, 0], [1, 1], [2, 1]],
    t: [[1, 1], [0, 0], [1, 0], [2, 0]],
    s: [[2, 1], [1, 1], [0, 0], [1, 0]],
    z: [[0, 1], [1, 1], [1, 0], [2, 0]],
    l: [[2, 1], [0, 0], [1, 0], [2, 0]],
    j: [[0, 1], [0, 0], [1, 0], [2, 0]]
};
/**ブロックの色 */
export const blockColor = {
    i: 0x33CCFF,
    t: 0xFF33FF,
    s: 0x99FF33,
    z: 0xFF3333,
    j: 0x4444FF,
    l: 0xFF8f00,
    o: 0xFFFF33,
    d: 0xFFFFFF,
    blank: 0x606060
};
/**ブロックのテクスチャー */
export const blockTextures = {
    hydrop: PIXI.Texture.from('img/mino_hydrop.png'),
    nidaime: PIXI.Texture.from('img/mino_nidaime.png'),
    hakkiri: PIXI.Texture.from('img/mino_hakkiri.png'),
    star: PIXI.Texture.from('img/mino_star.png'),
    bright: PIXI.Texture.from('img/mino_bright.png')
};
/**ミノの影のテクスチャー */
export const shadowTextures = {
    roughstone: PIXI.Texture.from('img/shadow_roughstone.png')
};