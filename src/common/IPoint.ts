/**
 * 基础 `点` 结构
 *
 * @export
 * @interface IPoint
 */
export interface IPoint {
    /**
     * x 坐标
     *
     * @type {number}
     * @memberof IPoint
     */
    x: number;
    /**
     * y 坐标
     *
     * @type {number}
     * @memberof IPoint
     */
    y: number;
    /**
     * 颜色
     *
     * @type {string}
     * @memberof IPoint
     */
    color?: string;
}
