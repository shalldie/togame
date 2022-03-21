import blessed, { Widgets } from 'blessed';
import { EDirection } from '../common';
import { config } from '../config';
import { IGame } from '../games';
import { UserInterfaceBase } from './base';

export interface IOption {
    label: string;
    value: new () => IGame;
}

const TITLE_HEIGHT = 3;

const OPTION_WIDTH = 12;
const OPTION_HEIGHT = 3;

export class GameListUI extends UserInterfaceBase {
    private options: IOption[] = [];

    private focusIndex = 0;

    private titleBox!: Widgets.BoxElement;

    private arrow!: Widgets.BoxElement;

    private boxes: Widgets.BoxElement[] = [];

    public choseOptions(options: IOption[]): Promise<IOption> {
        this.options = options;

        super.setup(OPTION_WIDTH * 2, OPTION_HEIGHT * (options.length + 2) + TITLE_HEIGHT);
        this.layout.border.type = 'line';
        this.layout.style.border.bg = '#000';
        this.createTitleBox();
        this.createArrow();
        this.createOptionBoxes();
        this.bindFocus();
        this.draw();

        return new Promise(resolve => {
            this.on('enter', () => {
                this.dispose();
                resolve(this.options[this.focusIndex]);
            });
        });
    }

    private createTitleBox() {
        this.titleBox = blessed.box({
            parent: this.layout,
            top: 1,
            left: 'center',
            width: '90%',
            height: TITLE_HEIGHT,
            align: 'center',
            valign: 'middle',
            content: `========== It's time to game! ==========`,
            tags: true,
            style: {
                fg: '#000',
                bg: '#fff'
            }
        });
    }

    private createArrow() {
        if (!this.arrow) {
            this.arrow = blessed.box({
                parent: this.layout,
                top: OPTION_HEIGHT * this.focusIndex + OPTION_HEIGHT + TITLE_HEIGHT,
                left: 0,
                width: (OPTION_WIDTH * config.WIDTH_SCALE) / 2,
                height: OPTION_HEIGHT,
                align: 'right',
                valign: 'middle',
                content: ' ===> ',
                style: {
                    fg: '#fff',
                    bg: '#000'
                }
            });
            return;
        }
        this.arrow.top = OPTION_HEIGHT * this.focusIndex + OPTION_HEIGHT + TITLE_HEIGHT;
    }

    private createOptionBoxes() {
        for (let i = 0; i < this.options.length; i++) {
            const box = blessed.box({
                parent: this.layout,
                top: OPTION_HEIGHT * i + OPTION_HEIGHT + TITLE_HEIGHT,
                left: (OPTION_WIDTH * config.WIDTH_SCALE) / 2 + 3,
                width: OPTION_WIDTH * config.WIDTH_SCALE,
                height: OPTION_HEIGHT,
                align: 'center',
                valign: 'middle',
                content: this.options[i].label,
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#666',
                        bg: '#000'
                    },
                    fg: '#000',
                    bg: '#666',
                    focus: {
                        fg: '#000',
                        bg: '#fff',
                        border: {
                            fg: '#fff'
                        }
                    }
                }
            });
            this.boxes.push(box);
        }
    }

    private bindFocus() {
        const setFocus = (index: number) => {
            this.focusIndex = index;
            if (this.focusIndex < 0) {
                this.focusIndex = this.options.length - 1;
            }
            if (this.focusIndex >= this.options.length) {
                this.focusIndex = 0;
            }
            this.boxes[this.focusIndex]?.focus();
            this.createArrow();
            this.draw();
        };

        this.on(EDirection.UP, () => {
            setFocus(this.focusIndex - 1);
        });

        this.on(EDirection.DOWN, () => {
            setFocus(this.focusIndex + 1);
        });
        setFocus(0);
    }
}
