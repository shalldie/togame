import { TetrisBlock } from './Block';
import { COLOR_LIST, SHAPE_STRUCTS } from './structs';

export class TetrisShape extends TetrisBlock {
    public blocks: TetrisBlock[] = [];

    constructor(options: Partial<TetrisShape> = {}) {
        super(options);
        Object.assign(this, options);
    }

    public static newShape(options: Partial<TetrisShape> = {}) {
        // 随机个颜色
        let len = COLOR_LIST.length;
        let rndIndex = ~~(Math.random() * len); // 随即个索引

        const color = COLOR_LIST[rndIndex]; // 随即出颜色

        // 随机个形状
        len = SHAPE_STRUCTS.length;
        rndIndex = ~~(Math.random() * len);

        const shapeTuple = SHAPE_STRUCTS[rndIndex];

        // 生成 blocks
        const blocks: TetrisBlock[] = [];
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (shapeTuple[x][y]) {
                    blocks.push(new TetrisBlock({ x, y, color }));
                }
            }
        }

        return new TetrisShape({
            color,
            blocks,
            ...options
        });
    }

    public clone() {
        const shape = new TetrisShape(this);
        shape.blocks = this.blocks.map(b => b.clone());
        return shape;
    }

    public rotate() {
        const rx0 = 1.5;
        const ry0 = 1.5;
        const func = function (x: number, y: number): [number, number] {
            const x0 = rx0 + ry0 - y;
            const y0 = ry0 - rx0 + x;
            return [x0, y0];
        };
        this.blocks.forEach(item => {
            const tuple = func(item.x, item.y);
            const x = tuple[0];
            const y = tuple[1];
            item.offset({
                x: x - item.x,
                y: y - item.y
            });
        });
        return this;
    }
}
