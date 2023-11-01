import React from 'react';
import { Bodies, Body, Engine, Events, Render, Runner, World } from 'matter-js';
import { FRUITS_BASE, FRUITS_HLW } from './fruits';
import './dark.css';

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

const main = () => {
    return <div></div>;
};

export default main;
