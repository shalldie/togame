#!/usr/bin/env node

import { Snake, Tetris } from './Games';
import { GameListUI } from './ui/GameListUI';
import { ScaleUI } from './ui';

async function main() {
    // 清屏
    process.stdout.write('\x1b[2J');
    process.stdout.write('\x1b[0f');

    // 调整 config
    await new ScaleUI().setup();

    // 选择游戏
    const opt = await new GameListUI().choseOptions([
        {
            label: '1. Game - Snake',
            value: Snake
        },
        {
            label: '2. Game - Tetris',
            value: Tetris
        }
    ]);

    const Game = opt.value;

    if (Game) {
        new Game().setup();
    }
}

main();
