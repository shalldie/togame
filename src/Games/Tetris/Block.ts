import { IPoint } from '../../shape';

export class TetrisBlock implements IPoint {
    public x = 0;
    public y = 0;
    public color = '#2ad';

    constructor(options: Partial<TetrisBlock> = {}) {
        Object.assign(this, options);
    }

    public clone() {
        return new TetrisBlock(this);
    }

    public offset(point: IPoint) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }
}
