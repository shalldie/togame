import blessed, { Widgets } from 'blessed';
import { EDirection } from '../common/EDirection';
import { config } from '../config';
import { UserInterfaceBase } from './base';

export interface IOption {
    label: string;
    value: any;
}

const OPTION_WIDTH = 12;
const OPTION_HEIGHT = 3;

export class ListUserInterface extends UserInterfaceBase {
    private options: IOption[] = [];

    private focusIndex = 0;

    private arrow!: Widgets.BoxElement;

    private boxes: Widgets.BoxElement[] = [];

    public choseOptions(options: IOption[]): Promise<IOption> {
        this.options = options;

        super.setup(OPTION_WIDTH * 2, OPTION_HEIGHT * (options.length + 3));
        this.layout.border.type = 'line';
        this.layout.style.border.bg = '#000';
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

    private createArrow() {
        if (!this.arrow) {
            this.arrow = blessed.box({
                parent: this.layout,
                top: OPTION_HEIGHT * this.focusIndex + OPTION_HEIGHT,
                right: (OPTION_WIDTH * config.WIDTH_SCALE * 3) / 4,
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
        this.arrow.top = OPTION_HEIGHT * this.focusIndex + OPTION_HEIGHT;
    }

    private createOptionBoxes() {
        for (let i = 0; i < this.options.length; i++) {
            const box = blessed.box({
                parent: this.layout,
                top: OPTION_HEIGHT * i + OPTION_HEIGHT,
                left: (OPTION_WIDTH * config.WIDTH_SCALE) / 2 + 3,
                // left: 'center',
                // right: (OPTION_WIDTH * config.WIDTH_SCALE * 2) / 4,
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
