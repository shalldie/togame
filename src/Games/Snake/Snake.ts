import { IGame } from '..';
import { EDirection } from '../../common/EDirection';
import { IPoint } from '../../shape';
import { GameUserInterface } from '../../ui';

const WIDTH = 18;
const HEIGHT = 18;
const INTERVAL = 200;

export class Snake implements IGame {
    private ui = new GameUserInterface();
    private timer: any;

    /** 当前食物 🍜 */
    private food!: IPoint;

    /** 当前🐍身 */
    private points: IPoint[] = [];

    /** 方向 🧭 */
    private direction: EDirection = EDirection.RIGHT;

    public setup(): void {
        // ui
        this.ui.setup(WIDTH + 2, HEIGHT + 3);
        this.ui.on(EDirection.UP, () => {
            if (this.direction === EDirection.DOWN) {
                return;
            }
            this.direction = EDirection.UP;
        });
        this.ui.on(EDirection.DOWN, () => {
            if (this.direction === EDirection.UP) {
                return;
            }
            this.direction = EDirection.DOWN;
        });
        this.ui.on(EDirection.LEFT, () => {
            if (this.direction === EDirection.RIGHT) {
                return;
            }
            this.direction = EDirection.LEFT;
        });
        this.ui.on(EDirection.RIGHT, () => {
            if (this.direction === EDirection.LEFT) {
                return;
            }
            this.direction = EDirection.RIGHT;
        });
        this.ui.on('enter', () => {
            this.reset();
            this.start();
        });
        this.reset();
        this.ui.draw();
        // 定时器
        this.start();
    }

    private reset() {
        this.ui.hideGameOver();
        // points
        this.points = [{ x: 1, y: 1 }];
        // direction
        this.direction = EDirection.RIGHT;
        // food
        this.newFood();
    }

    private run() {
        // check food, run
        this.checkFoodAndRun();

        // draw
        this.draw();

        // validate
        if (!this.validate()) {
            this.ui.showGameOver();
            this.stop();
            return;
        }
    }

    private nextPoints() {
        switch (this.direction) {
            case EDirection.UP:
                return this.offsetPoint({ x: 0, y: -1 });
            case EDirection.DOWN:
                return this.offsetPoint({ x: 0, y: 1 });
            case EDirection.LEFT:
                return this.offsetPoint({ x: -1, y: 0 });
            default:
                return this.offsetPoint({ x: 1, y: 0 });
        }
    }

    private offsetPoint(offset: IPoint): IPoint[] {
        const fp = this.points[0];
        const np: IPoint = {
            x: fp.x + offset.x,
            y: fp.y + offset.y
        };
        const queue = this.points.slice();
        queue.pop();
        queue.unshift(np);
        return queue;
    }

    private validate() {
        const fail = this.points.some((p, index) => {
            // 是否碰壁
            const outside = p.x < 0 || p.x > WIDTH || p.y < 0 || p.y > HEIGHT;
            // 是否碰撞
            const collision = this.points.some((p2, i2) => {
                return i2 !== index && p2.x === p.x && p2.y === p.y;
            });
            return outside || collision;
        });
        return !fail;
    }

    private newFood() {
        const point: IPoint = {
            x: ~~(Math.random() * WIDTH),
            y: ~~(Math.random() * HEIGHT)
        };
        // 不能出现在蛇身上
        if (this.points.some(p => p.x === point.x && p.y === point.y)) {
            this.newFood();
            return;
        }
        this.food = point;
    }

    private checkFoodAndRun() {
        const np = this.nextPoints()[0];
        // 吃到食物，不动
        if (np.x === this.food.x && np.y === this.food.y) {
            this.points.unshift(np);
            this.newFood();
        }
        // 否则前进一步
        else {
            this.points = this.nextPoints();
        }
    }

    public start() {
        this.stop();
        this.timer = setInterval(() => {
            this.run();
        }, INTERVAL);
    }

    public stop() {
        clearInterval(this.timer);
    }

    private draw() {
        this.ui.setRects([
            ...this.points,
            {
                ...this.food,
                color: '#f00'
            }
        ]);
        this.ui.setPromptContents([
            //
            'Game Snake',
            `Score: ${this.points.length - 1}`
        ]);
        this.ui.draw();
    }

    dispose(): void {
        this.stop();
        this.ui.dispose();
    }
}
