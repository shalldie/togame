import blessed, { Widgets } from 'blessed';
import { config } from '../config';
import { IPoint } from '../shape/IPoint';
import { UserInterfaceBase } from './base';

export class GameUserInterface extends UserInterfaceBase {
    public gameoverBox!: Widgets.BoxElement;

    protected initLayouts(width: number, height: number): void {
        super.initLayouts(width, height);

        this.gameoverBox = blessed.box({
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: 20,
            height: 6,
            tags: true,
            valign: 'middle',
            content: `{center}Game Over!\n\nPress enter to try again{/center}`,
            border: {
                type: 'line'
            },
            style: {
                fg: 'black',
                bg: 'magenta',
                border: {
                    fg: '#ffffff'
                }
            }
        });
        this.hideGameOver();
    }

    public setRects(points: IPoint[]) {
        this.playground.children.forEach(child => child.destroy());
        this.playground.children = [];
        points.forEach(p => {
            blessed.box({
                parent: this.playground,
                top: p.y,
                left: p.x * config.WIDTH_SCALE,
                width: 1 * config.WIDTH_SCALE,
                height: 1,
                // tags: true,
                style: {
                    bg: p.color || '#2ad'
                }
            });
        });
    }

    public showGameOver() {
        this.gameoverBox.show();
        this.draw();
    }

    public hideGameOver() {
        this.gameoverBox.hide();
        this.draw();
    }
}
