import { clean } from "./00-clean.js";
import { Circle } from "./01-circle.js";

const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

// States
let draw = () => {};

const control = document.getElementById("control");
const select = document.getElementById("select");

// Classes
const circle = new Circle();

select.addEventListener("input", (e) => {
  const val = e.currentTarget.value;

  switch (val) {
    case "select":
      control.innerHTML = "";
      draw = () => clean(canvas, data);
      break;
    case "circle":
      circle.addControl();
      draw = () => circle.draw(data);
      break;
  }
});

function render() {
  draw();
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(render);
}

render();
