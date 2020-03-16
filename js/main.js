const Engine = Matter.Engine,
  Events = Matter.Events,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  World = Matter.World,
  Bodies = Matter.Bodies;
const engine = Engine.create();

let windowX = window.innerWidth;
let windowY = window.innerHeight;
let centerInt = 0;

if (windowX > 450) {
  centerInt = windowX / 2 - 200;
}

// create a renderer
const render = Render.create({
  element: document.getElementById("game"),
  engine: engine,
  options: {
    width: windowX,
    height: windowY,
    wireframes: false,
    background: "#transparent"
  }
});

let ground = Bodies.rectangle(windowX / 2, windowY + 20, windowX, 40, {
  isStatic: true,
  label: "ground",
  render: {
    fillStyle: "black"
  }
});
let borderLeft = Bodies.rectangle(-20, windowY / 2, 40, windowY, {
  isStatic: true,
  label: "borderLeft",
  render: {
    fillStyle: "black"
  }
});
let borderRight = Bodies.rectangle(windowX + 20, windowY / 2, 40, windowY, {
  isStatic: true,
  label: "borderRight",
  render: {
    fillStyle: "black"
  }
});

let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });

World.add(engine.world, [ground, borderLeft, borderRight, mouseConstraint]);

let letter = obj => {
  return Bodies.rectangle(
    randomIntFromInterval(0, window.innerWidth),
    -50,
    obj.width,
    50,
    {
      render: {
        sprite: {
          texture: obj.image,
          xScale: 1,
          yScale: 1
        }
      },
      frictionAir: 0.025,
      restitution: 0.95,
      //slop: 0.5,
      friction: 0.9
    }
  );
};

let lastChar = null;

document.onkeypress = function(evt) {
  evt = evt || window.event;
  let charCode = evt.keyCode || evt.which;
  if (charCode !== lastChar) {
    lastChar = charCode;
    let charStr = String.fromCharCode(charCode);
    if (charCode === 13) {
      charStr = "Enter";
    } else if (charCode === 32) {
      charStr = "Space";
    }
    let imgObj = createImage(charStr);
    let body = letter(imgObj);
    World.add(engine.world, body);
  }
};

render.mouse = mouse;

Engine.run(engine);

Render.run(render);

function createImage($string) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  ctx.font = "32px sans-serif";
  let textWidth = ctx.measureText($string).width;

  if (textWidth > 50) {
    ctx.canvas.width = textWidth + 30;
    ctx.canvas.height = 50;
    background(textWidth + 30);
    drawText(textWidth + 30);
  } else {
    ctx.canvas.width = 50;
    ctx.canvas.height = 50;
    background(50);
    drawText(50);
  }

  function background(width) {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.rect(0, 0, width, 50);
    ctx.closePath();
    ctx.fill();
  }

  function drawText(width) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText($string, width / 2, 37.5);
  }

  let obj = {
    image: canvas.toDataURL("image/png"),
    width: ctx.canvas.width
  };
  return obj;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
