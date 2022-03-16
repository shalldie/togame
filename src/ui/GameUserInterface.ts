import blessed, { Widgets } from 'blessed';
import { config } from '../config';
import { IPoint } from '../shape/IPoint';
import { UserInterfaceBase } from './base';

export class GameUserInterface extends UserInterfaceBase {
    public playground!: Widgets.BoxElement;

    public tipBox!: Widgets.BoxElement;

    public promptBox!: Widgets.BoxElement;

    public gameoverBox!: Widgets.BoxElement;

    protected initLayouts(width: number, height: number): void {
        const widPrompt = 8;

        super.initLayouts(width + widPrompt + 4, height + 4);

        this.playground = blessed.box({
            parent: this.layout,
            top: 1,
            left: 4,
            width: width * config.WIDTH_SCALE,
            height: height,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: '#fff',
                    bg: '#000'
                },
                bg: '#000'
            }
        });

        this.tipBox = blessed.box({
            parent: this.layout,
            top: 1,
            right: 4,
            width: widPrompt * config.WIDTH_SCALE,
            height: 4,
            align: 'center',
            valign: 'middle',
            content: ['Ctrl: `↑ ↓ ← →`', 'Exit: `ctrl + c`'].join('\n'),
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: '#fff',
                    bg: '#000'
                },
                bg: '#000'
            }
        });

        this.promptBox = blessed.box({
            parent: this.layout,
            top: 5,
            right: 4,
            width: widPrompt * config.WIDTH_SCALE,
            height: 3,
            align: 'center',
            valign: 'middle',
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: '#fff',
                    bg: '#000'
                },
                bg: '#000'
            }
        });
        this.promptBox.hide();

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

    public setPromptContents(contents: string[] = []) {
        if (!contents.length) {
            this.promptBox.hide();
            return;
        }
        this.promptBox.setContent(contents.join('\n'));
        this.promptBox.height = contents.length + 2;
        this.promptBox.show();
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
