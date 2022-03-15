#!/usr/bin/env node

import inquirer from 'inquirer';
import { EGame, IGame } from './Games';
import { Snake } from './Games/Snake';

async function main() {
    const { gameName } = await inquirer.prompt({
        type: 'list',
        name: 'gameName',
        message: 'Choose the game you want.',
        choices: [
            {
                name: EGame.Snake + ' - 贪吃蛇',
                value: EGame.Snake
            },
            {
                name: EGame.Tetris + ' - 俄罗斯方块',
                value: EGame.Tetris
            }
        ]
    });

    const gameMap: Record<EGame, new () => IGame> = {
        [EGame.Snake]: Snake,
        [EGame.Tetris]: Snake
    };

    const Game = gameMap[gameName as EGame];

    if (Game) {
        new Game().setup();
    }
}

main();
