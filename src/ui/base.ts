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

    public playground!: Widgets.BoxElement;

    public promptBox!: Widgets.BoxElement;

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
        const widPrompt = 8;

        this.layout = blessed.box({
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: (width + widPrompt) * config.WIDTH_SCALE,
            height: height,
            tags: true
        });

        this.playground = blessed.box({
            parent: this.layout,
            top: 0,
            left: 0,
            width: width * config.WIDTH_SCALE,
            height: height,
            // tags: true,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: '#fff'
                },
                bg: '#000'
            }
        });

        this.promptBox = blessed.box({
            parent: this.layout,
            top: 0,
            right: 0,
            width: widPrompt * config.WIDTH_SCALE,
            height: 7,
            // content: ['Ctrl: ↑ ↓ ← →', 'Exit: ctrl + c'].join('\n'),
            align: 'center',
            valign: 'middle',
            // tags: true,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: '#fff'
                },
                bg: '#000'
            }
        });
        this.setPromptContents();
    }

    public setPromptContents(contents: string[] = []) {
        if (contents.length) {
            contents.push('--------------------');
        }
        contents = [...contents, 'Ctrl: `↑ ↓ ← →`', 'Exit: `ctrl + c`'];
        this.promptBox.content = contents.join('\n');
        this.promptBox.height = contents.length + 2;
    }

    public draw() {
        this.screen.render();
    }

    dispose(): void {
        this.screen.destroy();
    }
}
