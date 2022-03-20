export * from './Snake';
export * from './Tetris';

/**
 * 游戏基础接口
 *
 * @export
 * @interface IGame
 * @extends {ISetable}
 * @extends {IDisposable}
 */
export interface IGame extends ISetable, IDisposable {}
