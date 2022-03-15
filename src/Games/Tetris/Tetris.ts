import { IGame } from '..';
import { IPoint } from '../../shape';
import { GameUserInterface } from '../../ui';

const WIDTH = 12;
const HEIGHT = 20;
const INTERVAL = 200;

export class Tetris implements IGame {
    private ui = new GameUserInterface();
    private timer: any;

    /** 当前方块 */
    private points: IPoint[] = [];

    public setup(): void {
        // ui
        this.ui.setup(WIDTH + 2, HEIGHT + 3);

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
    }

    public start() {
        this.stop();
        this.timer = setInterval(() => {
            // this.run();
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
