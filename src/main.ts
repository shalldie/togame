#!/usr/bin/env node

import { IGame } from './Games';
import { Snake } from './Games/Snake';
import { Tetris } from './Games/Tetris';
import { ListUserInterface } from './ui/ListUserInterface';
import { ScaleUserInterface } from './ui/ScaleUserInterface';

async function main() {
    // 清屏
    process.stdout.write('\x1b[2J');
    process.stdout.write('\x1b[0f');

    // 调整 config
    await new ScaleUserInterface().setup();

    // 选择游戏
    const opt = await new ListUserInterface().choseOptions([
        {
            label: '1. Game - Snake',
            value: Snake
        },
        {
            label: '2. Game - Tetris',
            value: Tetris
        }
    ]);

    const Game = opt.value as new () => IGame;

    if (Game) {
        new Game().setup();
    }
}

main();
