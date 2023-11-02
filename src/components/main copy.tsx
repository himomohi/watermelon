// ```jsx
import React, { useEffect, useState, useRef } from "react";
import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE, FRUITS_HLW } from "./fruits";
import "./dark.css";

const Main = () => {
  const [engine, setEngine] = useState(null);
  const [render, setRender] = useState(null);
  const [world, setWorld] = useState(null);
  const [currentBody, setCurrentBody] = useState(null);
  const [currentFruit, setCurrentFruit] = useState(null);
  const [disableAction, setDisableAction] = useState(false);
  const [interval, setIntervalState] = useState(null);
  const containerRef = useRef(null); // 컨테이너 참조 생성

  useEffect(() => {
    if (!containerRef.current) return; // 컨테이너가 없으면 반환

    let THEME = "base"; // {base,halloween}
    let FRUITS = FRUITS_BASE;

    // THEME 테마가 halloween 으로 입력되면 할로윈 버전으로
    switch (THEME) {
      case "halloween":
        FRUITS = FRUITS_HLW;
        break;
      default:
        FRUITS = FRUITS_BASE;
    }

    // 엔진 설정
    const localEngine = Engine.create();
    const localRender = Render.create({
      engine: localEngine,
      element: containerRef.current, // 컨테이너에 렌더링
      options: {
        wireframes: false,
        background: "#F7F4C8",
        width: 620,
        height: 850,
      },
    });
    // 월드 그리기
    const localWorld = localEngine.world;

    // 벽 설정
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
      render: { fillStyle: "#0d0c09" },
    });

    World.add(localWorld, [leftWall, rightWall, ground, topLine]);

    setEngine(localEngine);
    setRender(localRender);
    setWorld(localWorld);

    Render.run(localRender); // 렌더
    Runner.run(localEngine); // 런너

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

      setCurrentBody(body);
      setCurrentFruit(fruit);
      World.add(localWorld, body);
    }

    addFruit();

    // 키 입력
    const handleKeyDown = (event) => {
      if (disableAction) {
        return;
      }

      switch (event.code) {
        case "KeyA":
          if (interval) return;
          setIntervalState(
            setInterval(() => {
              if (currentBody.position.x - currentFruit.radius > 30)
                Body.setPosition(currentBody, {
                  x: currentBody.position.x - 1,
                  y: currentBody.position.y,
                });
            }, 5)
          );
          break;

        case "KeyD":
          if (interval) return;
          setIntervalState(
            setInterval(() => {
              if (currentBody.position.x + currentFruit.radius < 590)
                Body.setPosition(currentBody, {
                  x: currentBody.position.x + 1,
                  y: currentBody.position.y,
                });
            }, 5)
          );
          break;

        case "KeyS":
          currentBody.isSleeping = false;
          setDisableAction(true);

          setTimeout(() => {
            addFruit();
            setDisableAction(false);
          }, 1000);

          break;
      }
    };

    // 키를 땔 때
    const handleKeyUp = (event) => {
      switch (event.code) {
        case "KeyA":
        case "KeyD":
          clearInterval(interval);
          setIntervalState(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 충돌 이벤트
    Events.on(localEngine, "collisionStart", (event) => {
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
        } // ... 기존 코드 ...
      });
    });

    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [interval, disableAction, currentBody, currentFruit]);

  return <div ref={containerRef}></div>; // 렌더링 대상 컨테이너
};

export default Main;
