import { IGame } from '..';
import { EDirection } from '../../common';
import { IPoint } from '../../common';
import { GameUI } from '../../ui';
import { TetrisBlock } from './Block';
import { TetrisShape } from './Shape';

const WIDTH = 12; // 画布宽
const HEIGHT = 20; // 画布高
const INTERVAL = 800; // interval

/**
 * 俄罗斯方块
 *
 * @export
 * @class Tetris
 * @implements {IGame}
 */
export class Tetris implements IGame {
    private score = 0;
    private ui = new GameUI();
    private timer: any;

    /** 当前静止的方块 */
    private blockMap!: (TetrisBlock | undefined)[][];

    private shape!: TetrisShape;

    public setup(): void {
        // ui
        this.ui.setup(WIDTH + 1, HEIGHT + 2);

        this.ui.on('enter', () => {
            this.reset();
            this.start();
        });

        this.ui.on(EDirection.UP, () => {
            this.moveShape(EDirection.UP);
            this.draw();
        });

        this.ui.on(EDirection.LEFT, () => {
            this.moveShape(EDirection.LEFT);
            this.draw();
        });

        this.ui.on(EDirection.RIGHT, () => {
            this.moveShape(EDirection.RIGHT);
            this.draw();
        });

        this.ui.on(EDirection.DOWN, () => {
            this.moveShape(EDirection.DOWN, true);
            this.draw();
        });

        this.reset();
        this.ui.draw();
        // 定时器
        this.start();
    }

    private reset() {
        this.ui.hideGameOver();
        this.score = 0;
        // blockMap
        this.blockMap = Array.from(Array(WIDTH)).map(() => []);
        // shape
        this.shape = null as any;
        this.newShape();
    }

    private newShape() {
        // 老 shape 归位
        if (this.shape) {
            this.shape.blocks.forEach(block => {
                block.x += this.shape.x;
                block.y += this.shape.y;
                this.blockMap[block.x][block.y] = block;
            });
        }
        // 新 shape 生成
        this.shape = TetrisShape.newShape({
            x: ~~(WIDTH / 2) - 2,
            y: -2
        });
    }

    /**
     * 是否可以移动
     *
     * @private
     * @param {IPoint} offset
     * @return {*}  {boolean}
     * @memberof Tetris
     */
    private canMove(offset: IPoint): boolean {
        const { x, y } = offset;
        return this.shape.blocks.every(n => {
            const xPos = n.x + x + this.shape.x;
            const yPos = n.y + y + this.shape.y;

            // 出界
            const outside = xPos < 0 || xPos >= WIDTH || yPos >= HEIGHT;

            // 有方块阻碍
            const hit = !!this.blockMap[xPos]?.[yPos];

            return !outside && !hit;
        });
    }

    /**
     * 是否可以旋转
     *
     * @private
     * @return {*}  {boolean}
     * @memberof Tetris
     */
    private canRotate(): boolean {
        const shape = this.shape.clone().rotate();
        return !shape.blocks.some(n => {
            const xPos = n.x + this.shape.x;
            const yPos = n.y + this.shape.y;

            // 出界
            if (xPos < 0 || xPos >= WIDTH || yPos >= HEIGHT) return true;

            // 有方块阻碍
            return !!this.blockMap[xPos][yPos];
        });
    }

    private checkRow(rowNum = HEIGHT - 1) {
        if (rowNum <= 0) {
            return;
        }

        const fullRow = this.blockMap.every(row => !!row[rowNum]);

        // 非满行，向上
        if (!fullRow) {
            this.checkRow(rowNum - 1);
            return;
        }
        this.score++;

        // 满行，整体下移，并重新检查当前行
        for (let y = rowNum; y >= 0; y--) {
            for (let x = 0; x < WIDTH; x++) {
                if (y === 0) {
                    this.blockMap[x][y] = undefined;
                    continue;
                }
                this.blockMap[x][y] = this.blockMap[x][y - 1];
                if (this.blockMap[x][y]) {
                    this.blockMap[x][y]!.y = y;
                }
            }
        }
        this.checkRow(rowNum);
    }

    private moveShape(direction: EDirection, repeat = false) {
        let offset: IPoint | null = null;
        switch (direction) {
            case EDirection.UP:
                if (this.canRotate()) {
                    this.shape.rotate();
                }
                break;

            case EDirection.LEFT:
                offset = { x: -1, y: 0 };
                break;

            case EDirection.RIGHT:
                offset = { x: 1, y: 0 };
                break;

            case EDirection.DOWN:
                offset = { x: 0, y: 1 };
                break;
        }

        if (!offset) {
            this.draw();
            return;
        }

        if (!this.canMove(offset)) {
            return;
        }

        this.shape.offset(offset);

        if (repeat) {
            this.moveShape(direction, repeat);
        }
    }

    private validate() {
        const ok = this.blockMap.every(col => !col[0]);
        if (!ok) {
            this.ui.showGameOver();
            this.stop();
        }
    }

    private step() {
        // 新 shape
        if (!this.canMove({ x: 0, y: 1 })) {
            this.newShape();
        }

        // 消除
        this.checkRow();

        // 向下
        this.moveShape(EDirection.DOWN);

        // validate
        this.validate();

        this.draw();
    }

    private draw() {
        this.ui.setRects([
            // background
            ...(this.blockMap.flat().filter(n => !!n) as TetrisBlock[]),
            // shape
            ...this.shape.blocks.map(b => ({
                x: this.shape.x + b.x,
                y: this.shape.y + b.y,
                color: this.shape.color
            }))
        ]);
        this.ui.setPromptContents([
            //
            'Game Tetris',
            `Score: ${this.score}`
        ]);
        this.ui.draw();
    }

    public start() {
        this.stop();
        this.step();
        this.timer = setInterval(() => {
            this.step();
        }, INTERVAL);
    }

    public stop() {
        clearInterval(this.timer);
    }

    dispose(): void {
        this.stop();
        this.ui.dispose();
    }
}
