import blessed, { Widgets } from 'blessed';
import { EDirection } from '../common';
import { config } from '../config';
import { UserInterfaceBase } from './base';

export class ScaleUI extends UserInterfaceBase {
    public playground!: Widgets.BoxElement;

    public setup(): Promise<void> {
        const WID = 12;
        super.setup(WID, WID);

        this.playground = blessed.box({
            parent: this.layout,
            top: 'center',
            left: 'center',
            width: WID * config.WIDTH_SCALE,
            height: WID,
            align: 'center',
            valign: 'middle',
            content: [
                //
                'Press `up/down`,',
                'to make this square,',
                '',
                'then `enter` to confirm'
            ].join('\n'),
            border: {
                type: 'bg'
            },
            style: {
                border: {
                    bg: '#2ad'
                },
                fg: '#000',
                bg: '#2ad'
            }
        });

        this.on(EDirection.UP, () => {
            config.WIDTH_SCALE++;
            this.playground.width = WID * config.WIDTH_SCALE;
            this.draw();
        });

        this.on(EDirection.DOWN, () => {
            config.WIDTH_SCALE = Math.max(config.WIDTH_SCALE - 1, 1);
            this.playground.width = WID * config.WIDTH_SCALE;
            this.draw();
        });

        this.draw();

        return new Promise(resolve => {
            this.on('enter', () => {
                this.dispose();
                resolve();
            });
        });
    }
}
