import inquirer from 'inquirer';
import blessed from 'blessed';

// import { WIDTH_SCALE } from './config';
import { UserInterface } from './ui';
import { WIDTH_SCALE } from './config';

enum EGame {
    Snake = 'Snake',
    Tetris = 'Tetris'
}

async function main3() {
    const { game } = await inquirer.prompt({
        type: 'list',
        name: 'game',
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

    if (game === EGame.Snake) {
        main();
    }
}

function main5() {
    const screen = blessed.screen({
        smartCSR: true,
        autoPadding: true
    });
    screen.key(['escape', 'q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });

    screen.title = 'my window title';

    // const program = blessed.program();

    // program.key('q', function (ch, key) {
    //     program.clear();
    //     program.disableMouse();
    //     program.showCursor();
    //     program.normalBuffer();
    //     process.exit(0);
    // });

    const layout = blessed.box({
        parent: screen,
        top: 'center',
        left: 'center',
        width: 30 * WIDTH_SCALE,
        height: 30,
        // content: 'Hello {bold}world{/bold}!',
        tags: true,
        border: {
            type: 'line'
        }
    });

    blessed.box({
        parent: layout,
        top: 0,
        left: 0 * WIDTH_SCALE,
        width: 1 * WIDTH_SCALE,
        height: 1,
        // content: 'Hello {bold}world{/bold}!',
        tags: true,
        // border: {
        //     type: 'line'
        // },
        style: {
            // fg: 'white',
            bg: '#2ad'
            // border: {
            //     fg: '#2ad'
            // }
        }
    });

    blessed.box({
        parent: layout,
        top: 1,
        left: 1 * WIDTH_SCALE,
        width: 1 * WIDTH_SCALE,
        height: 1,
        // content: 'Hello {bold}world{/bold}!',
        tags: true,
        // border: {
        //     type: 'line'
        // },
        style: {
            // fg: 'white',
            bg: '#2ad'
            // border: {
            //     fg: '#2ad'
            // }
        }
    });

    blessed.box({
        parent: layout,
        top: 2,
        left: 2 * WIDTH_SCALE,
        width: 1 * WIDTH_SCALE,
        height: 1,
        // content: 'Hello {bold}world{/bold}!',
        tags: true,
        // border: {
        //     type: 'line'
        // },
        style: {
            // fg: 'white',
            bg: '#2ad'
            // border: {
            //     fg: '#2ad'
            // }
        }
    });

    blessed.box({
        parent: layout,
        top: 1,
        left: 3 * WIDTH_SCALE,
        width: 1 * WIDTH_SCALE,
        height: 1,
        // content: 'Hello {bold}world{/bold}!',
        tags: true,
        // border: {
        //     type: 'line'
        // },
        style: {
            // fg: 'white',
            bg: '#2ad'
            // border: {
            //     fg: '#2ad'
            // }
        }
    });

    // for (let x = 0; x < 1; x++) {
    //     for (let y = 0; y < 1; y++) {
    //         blessed.box({
    //             parent: layout,
    //             top: y,
    //             left: x,
    //             width: 3,
    //             height: 1,
    //             // content: 'Hello {bold}world{/bold}!',
    //             tags: true,
    //             // border: {
    //             //     type: 'line'
    //             // },
    //             style: {
    //                 // fg: 'white',
    //                 bg: '#2ad'
    //                 // border: {
    //                 //     fg: '#2ad'
    //                 // }
    //             }
    //         });
    //     }
    // }

    // Append our box to the screen.
    // screen.append(box);
    // screen.render();
}

function main() {
    const ui = new UserInterface();
    ui.setup(30, 30);

    let s = 0;

    function rndPoint() {
        return {
            x: ~~(Math.random() * 27) + 1,
            y: ~~(Math.random() * 27) + 1
        };
    }

    ui.on('up', () => {
        ui.setPromptContents([
            //
            'Game Snake',
            `Score: ${s++}`
        ]);

        ui.setRects([rndPoint(), rndPoint()]);

        // console.log(ui['playground'])
        ui.draw();
    });
    ui.draw();
}

main();
