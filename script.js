const context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 400;
context.canvas.width = 1220;

// obstacles
// start frame count at 1 (level 1)
let frameCount = 1;
// set obcount to level
let obCount = frameCount;
// create collection to hold rondow x coords
const obXCoors = [];

// "player"
const square = {
  side: 40,
  jumping: true,
  x: 0,
  xVelocity: 0,
  y: 0,
  yVelocity: 0,
};

const room = {
  height: context.canvas.height,
  width: context.canvas.width,
  groundHeight: 30,
};

// create obstacles
const nextFrame = () => {
  frameCount++;
  for (let index = 0; index < obCount; index++) {
    obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
    obXCoors.push(obXCoor);
  }
};

// keyboard controlls
const controller = {
  left: false,
  right: false,
  up: false,

  keyListener: function (event) {
    let key_state = event.type == "keydown" ? true : false;

    switch (event.keyCode) {
      case 37: // left arrow
        controller.left = key_state;
        break;
      case 38: // up arrow
        controller.up = key_state;
        break;
      case 39: // right arrow
        controller.right = key_state;
        break;
    }
  },
};

const loop = () => {
  if (controller.up && square.jumping == false) {
    square.yVelocity -= 20;
    square.jumping = true;
    // console.log(square.y);
  }

  if (controller.left) {
    square.xVelocity -= 0.5;
    // console.log(square.x);
  }

  if (controller.right) {
    square.xVelocity += 0.5;
    // console.log(square.x);
  }

  // gravity & friction
  square.yVelocity += 1.5; // gravity
  square.x += square.xVelocity;
  square.y += square.yVelocity;
  square.xVelocity *= 0.9; // friction
  square.yVelocity *= 0.9; // friction

  // square should not be higher than the room - groundline - square side combined
  // when not jumping, if it is we put it on the ground
  // INFO: x and y start in top left so bottom is 400 and top is 0
  // thats why you need to use minus to move it "up"
  if (square.y > room.height - room.groundHeight - square.side) {
    square.jumping = false;
    square.y = room.height - room.groundHeight - square.side;
    square.yVelocity = 0;
  }

  // if half of the square goes beyond left side
  // it comes out the right side
  // if square leaves right side completely
  // it comes out the left side
  if (square.x < -(square.side / 2)) {
    // left is -x
    square.x = room.width;
  } else if (square.x > room.width) {
    square.x = 0;
    nextFrame();
  }

  // background
  context.fillStyle = "#201A23";
  context.fillRect(0, 0, room.width, room.height);

  // cube
  context.fillStyle = "#8DAA9D";
  context.beginPath();
  context.rect(square.x, square.y, square.side, square.side);
  context.fill();

  // obstacle
  const height = 200 * Math.cos(Math.PI / 6);
  context.fillStyle = "#FBF5F3";
  obXCoors.forEach((obXCoors) => {
    context.beginPath();
    context.moveTo(obXCoors, room.height);
    context.lineTo(obXCoors + 20, room.height);
    context.lineTo(obXCoors + 10, 510 - height);
    context.closePath();
    context.fill();
  });

  // ground
  // INFO: x and y start in top left so bottom is 400 and top is 0
  // thats why you need to use minus to have it at the bottom
  context.fillStyle = "#2E2532";
  context.fillRect(
    0,
    room.height - room.groundHeight,
    room.width,
    room.groundHeight
  );

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);
};

// update browser to draw next frame
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
