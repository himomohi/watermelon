import React from 'react';
import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js';
import { FRUITS_BASE, FRUITS_HLW } from './fruits';
import './dark.css';

//실행라인
const main = () => {
    let THEME = 'base'; // {base,halloween}
    let FRUITS = FRUITS_BASE;

    //THEME 테마가 halloween 으로 입력되면 할로윈 버전으로
    switch (THEME) {
        case 'halloween':
            FRUITS = FRUITS_HLW;
            break;
        default:
            FRUITS = FRUITS_BASE;
    }

    //엔진설정
    const engine = Engine.create();
    const render = Render.create({
        engine,
        element: document.body,
        options: {
            wireframes: false,
            background: '#F7F4C8',
            width: 620,
            height: 850,
        },
    });
    // 월드 그리기
    const world = engine.world;

    //벽설정
    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
        isStatic: true,
        render: { fillStyle: '#0d0c09' },
    });

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
        isStatic: true,
        render: { fillStyle: '#0d0c09' },
    });

    const ground = Bodies.rectangle(310, 820, 620, 60, {
        isStatic: true,
        render: { fillStyle: '#0d0c09' },
    });
    const topLine = Bodies.rectangle(310, 150, 620, 2, {
        isStatic: true,
        render: { fillStyle: '#0d0c09' },
    });

    World.add(world, [leftWall, rightWall, ground, topLine]);

    Render.run(render); // 렌더
    Runner.run(engine); //런너

    //값 초기화
    let currentBody = null;
    let currentFruit = null;
    let disableAction = false;
    let interval = null;

    //과일추가
    function addFruit() {
        const index = Math.floor(Math.random() * 5);
        const fruit = FRUITS[index];

        const body = Bodies.circle(300, 50, fruit.radius, {
            index: index,
            isSleeping: true,
            render: {
                sprite: { texture: `${fruit.name}.png` },
            },
            restitution: 0.2,
        });

        currentBody = body;
        currentFruit = fruit;
        World.add(world, body);
    }
    //키입력

    window.onkeydown = (event) => {
        if (disableAction) {
            return;
        }

        switch (event.code) {
            case 'KeyA':
                if (interval) return;
                interval = setInterval(() => {
                    if (currentBody.position.x - currentFruit.radius > 30)
                        Body.setPosition(currentBody, {
                            x: currentBody.position.x - 1,
                            y: currentBody.position.y,
                        });
                }, 5);
                break;

            case 'KeyD':
                if (interval) return;
                interval = setInterval(() => {
                    if (currentBody.position.x + currentFruit.radius > 590)
                        Body.setPosition(currentBody, {
                            x: currentBody.position.x + 1,
                            y: currentBody.position.y,
                        });
                }, 5);
                break;

            case 'KeyS':
                currentBody.isSleeping = false;
                disableAction = true;

                setTimeout(() => {
                    addFruit();
                    disableAction = false;
                }, 1000);

                break;
        }
    };

    //키를 땔때
    window.onkeyup = (event) => {
        switch (event.code) {
            case 'KeyA':
            case 'KeyD':
                clearInterval(interval);
                interval = null;
        }
    };
    Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach((collision) => {
            if (collision.bodyA.index === collision.bodyB.index) {
                const index = collision.bodyA.index;

                if (index === FRUITS.length - 1) {
                    return;
                }

                World.remove(world, [collision.bodyA, collision.bodyB]);

                const newFruit = FRUITS[index + 1];

                const newBody = Bodies.circle(
                    collision.collision.supports[0].x,
                    collision.collision.supports[0].y,
                    newFruit.radius,
                    {
                        render: {
                            sprite: { texture: `${newFruit.name}.png` },
                        },
                        index: index + 1,
                    }
                );

                World.add(world, newBody);
            }

            if (!disableAction && (collision.bodyA.name === 'topLine' || collision.bodyB.name === 'topLine')) {
                alert('Game over');
            }
        });
    });
    addFruit();

    return <div></div>;
};

export default main;
