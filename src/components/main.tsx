import React from 'react';
import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js';
import { FRUITS_BASE, FRUITS_HLW } from './fruits';
// import './dark.css';

let THEME = 'halloween'; // {base,halloween}
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

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: '#0d0c09' },
});

const main = () => {
    World.add(world, [leftWall]);

    Engine.run(engine); // 엔진 실행
    Render.run(render); // 렌더러 실행
    return <div></div>;
};

export default main;
