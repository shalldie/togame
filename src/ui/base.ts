import blessed, { Widgets } from 'blessed';
import EventEmitter from 'events';
import { config } from '../config';

/**
 * 基础画布结构
 *
 * @export
 * @class UserInterfaceBase
 * @extends {EventEmitter}
 * @implements {ISetable}
 * @implements {IDisposable}
 */
export class UserInterfaceBase extends EventEmitter implements ISetable, IDisposable {
    public screen: Widgets.Screen = blessed.screen({
        smartCSR: true,
        autoPadding: true,
        title: 'Game >_<#@!'
    });

    public layout!: Widgets.BoxElement;

    /**
     * 初始化
     *
     * @param {number} width
     * @param {number} height
     * @memberof UserInterfaceBase
     */
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
            tags: true,
            border: {
                type: 'bg'
            },
            style: {
                bg: '#000'
            }
        });
    }

    /**
     * 重绘
     *
     * @memberof UserInterfaceBase
     */
    public draw() {
        this.screen.render();
    }

    /**
     * 释放资源
     *
     * @memberof UserInterfaceBase
     */
    dispose(): void {
        this.screen.destroy();
    }
}
