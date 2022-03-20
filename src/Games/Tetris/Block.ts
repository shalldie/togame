import { IPoint } from '../../common';

/**
 * 基础 `块` - 俄罗斯方块
 *
 * @export
 * @class TetrisBlock
 * @implements {IPoint}
 */
export class TetrisBlock implements IPoint {
    public x = 0;
    public y = 0;
    public color = '#2ad';

    constructor(options: Partial<TetrisBlock> = {}) {
        Object.assign(this, options);
    }

    /**
     * 克隆
     *
     * @return {*}
     * @memberof TetrisBlock
     */
    public clone() {
        return new TetrisBlock(this);
    }

    /**
     * 偏移
     *
     * @param {IPoint} point
     * @return {*}
     * @memberof TetrisBlock
     */
    public offset(point: IPoint) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }
}
