let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  }
});

export { rightPressed, leftPressed };
