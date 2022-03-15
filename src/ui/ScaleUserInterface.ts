import blessed, { widget, Widgets } from 'blessed';
import { EDirection } from '../common/EDirection';
import { config } from '../config';
import { UserInterfaceBase } from './base';

export class ScaleUserInterface extends UserInterfaceBase {
    public setup(): Promise<void> {
        const WID = 16;
        super.setup(WID, WID);
        this.promptBox.hide();

        this.playground.left = 'center';
        this.playground.top = 'center';
        this.playground['align'] = 'center';
        this.playground['valign'] = 'middle';
        this.playground.style.fg = '#000';
        this.playground.style.bg = '#2ad';
        this.playground.style.border.fg = '#2ad';
        this.playground.style.border.bg = '#2ad';

        this.playground.setContent(
            [
                //
                'Press `up/down` to make this square,',
                'and `enter` to confirm'
            ].join('\n')
        );

        this.on(EDirection.UP, () => {
            // config.WIDTH_SCALE = Math.min(config.WIDTH_SCALE - 1, 1);
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
