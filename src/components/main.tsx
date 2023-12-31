import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE, FRUITS_HLW } from "./fruits";
import "./dark.css";

//실행라인

interface Scores {
  newScore: number;
  highScores: number;
}

const main = () => {
  let score = 0;
  let THEME = "base"; // {base,halloween}
  let FRUITS = FRUITS_BASE;
  let high = 0;

  function highScore2(newScore) {
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    highScores.push(newScore);

    highScores.sort((a, b) => b - a);

    localStorage.setItem("highScores", JSON.stringify(highScores));

    high += highScores;
  }

  function createScoreDisplay() {
    const scoreElement = document.createElement("div");
    scoreElement.id = "score"; // 점수 표시할 요소의 id 설정
    scoreElement.style.position = "absolute";
    // scoreElement.style.top = '10px';
    scoreElement.style.left = "50%";
    scoreElement.style.transform = "translateX(-50%)";
    scoreElement.style.fontSize = "24px";
    scoreElement.style.color = "white";
    scoreElement.innerHTML = `점수: ${score}`;
    document.body.appendChild(scoreElement);
  }

  // 점수를 갱신하고 화면에 표시하는 함수
  function updateScore(points: number) {
    score += points; // 점수를 증가
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
      scoreElement.innerText = `점수: ${score}`; // 점수를 화면에 표시
    }
  }

  // 점수 표시를 위한 HTML 요소를 생성하는 함수 호출
  createScoreDisplay();

  //THEME 테마가 halloween 으로 입력되면 할로윈 버전으로
  switch (THEME) {
    case "halloween":
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
      wireframes: true,
      background: "#F7F4C8",
      width: 620,
      height: 850,
    },
  });
  // 월드 그리기
  const world = engine.world;

  //벽설정
  const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#0d0c09" },
  });

  const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: { fillStyle: "#0d0c09" },
  });

  const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: { fillStyle: "#0d0c09" },
  });
  const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true,
    isSensor: true,
    label: "topLine",
    render: { fillStyle: "#0d0c09" },
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
      case "KeyA":
        if (interval) return;
        interval = setInterval(() => {
          if (currentBody.position.x - currentFruit.radius > 30)
            Body.setPosition(currentBody, {
              x: currentBody.position.x - 1,
              y: currentBody.position.y,
            });
        }, 5);
        break;

      case "KeyD":
        if (interval) return;
        interval = setInterval(() => {
          if (currentBody.position.x + currentFruit.radius < 590)
            Body.setPosition(currentBody, {
              x: currentBody.position.x + 1,
              y: currentBody.position.y,
            });
        }, 5);
        break;

      case "KeyS":
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
      case "KeyA":
      case "KeyD":
        clearInterval(interval);
        interval = null;
    }
  };
  Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
      if (collision.bodyA.index === collision.bodyB.index) {
        const index = collision.bodyA.index;

        if (index === FRUITS.length - 1) {
          return;
        }

        //점수추가

        World.remove(world, [collision.bodyA, collision.bodyB]);

        const newFruit = FRUITS[index + 1];
        updateScore(newFruit.score);

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
      // 충돌하는 객체 중 하나가 topLine일 경우를 확인합니다.
      const collidedWithTopLine =
        collision.bodyA === topLine || collision.bodyB === topLine;
      const otherBody =
        collision.bodyA === topLine ? collision.bodyB : collision.bodyA;

      // topLine과 충돌한 객체가 위로 올라가고 있는지 확인합니다. (y 방향 속도가 음수일 경우)
      const isMovingUpwards = otherBody.velocity.y < 0 && !otherBody.isStatic;

      // 만약 topLine에 닿았고, 객체가 위로 올라가고 있다면 게임 오버 처리를 합니다.
      if (collidedWithTopLine && isMovingUpwards) {
        alert("게임 오버!");
        highScore2(score);
        // 게임을 재시작하거나, 페이지를 새로고침하는 로직을 추가할 수 있습니다.
      }
    });
  });
  addFruit();

  return (
    <>
      <div>최고점수 :{high}</div>
    </>
  );
};

export default main;
