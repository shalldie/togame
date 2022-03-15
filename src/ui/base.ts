import blessed, { Widgets } from 'blessed';
import EventEmitter from 'events';
import { config } from '../config';

export class UserInterfaceBase extends EventEmitter implements ISetable, IDisposable {
    public screen: Widgets.Screen = blessed.screen({
        smartCSR: true,
        autoPadding: true,
        title: 'Game >_<#@!'
    });

    public layout!: Widgets.BoxElement;

    public setup(width: number, height: number) {
        this.initEvents();
        this.initLayouts(width, height);
    }

    protected initEvents() {
        this.screen.key(['escape', 'C-c'], () => {
            return process.exit(0);
        });

        this.screen.on('keypress', (_, key) => {
            this.emit(key.name);
        });
    }

    protected initLayouts(width: number, height: number) {
        this.layout = blessed.box({
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: width * config.WIDTH_SCALE,
            height: height,
            tags: true
        });
    }

    public draw() {
        this.screen.render();
    }

    dispose(): void {
        this.screen.destroy();
    }
}
