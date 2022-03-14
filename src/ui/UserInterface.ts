import blessed from 'blessed';
import EventEmitter from 'events';
import { WIDTH_SCALE } from '../config';
import { IPoint } from '../shape/IPoint';

export class UserInterface extends EventEmitter implements ISetable, IDisposable {
    private screen = blessed.screen({
        smartCSR: true,
        autoPadding: true,
        title: 'Game >_<#@!'
    });

    private layout!: any;

    private playground!: any;

    private promptBox!: any;

    public setup(width: number, height: number) {
        this.initEvents();
        this.initLayouts(width, height);
    }

    private initEvents() {
        this.screen.key(['escape', 'q', 'C-c'], () => {
            return process.exit(0);
        });

        this.screen.on('keypress', (_, key) => {
            this.emit(key.name);
        });
    }

    private initLayouts(width: number, height: number) {
        const widPrompt = 8;

        this.layout = blessed.box({
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: (width + widPrompt) * WIDTH_SCALE,
            height: height,
            tags: true
        });

        this.playground = blessed.box({
            parent: this.layout,
            top: 0,
            left: 0,
            width: width * WIDTH_SCALE,
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
            width: widPrompt * WIDTH_SCALE,
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
        contents = [...contents, 'Ctrl: ↑ ↓ ← →', 'Exit: ctrl + c'];
        this.promptBox.content = contents.join('\n');
        this.promptBox.height = contents.length + 2;
    }

    public setRects(points: IPoint[]) {
        this.playground.children.forEach(child => child.destroy());
        this.playground.children = [];
        points.forEach(p => {
            blessed.box({
                parent: this.playground,
                top: p.y,
                left: p.x * WIDTH_SCALE,
                width: 1 * WIDTH_SCALE,
                height: 1,
                // tags: true,
                style: {
                    bg: p.color || '#2ad'
                }
            });
        });
    }

    public draw() {
        this.screen.render();
    }

    dispose(): void {
        this.screen.destroy();
    }
}
