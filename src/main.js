import { clean } from "./00-clean.js";
import { drawCircle } from "./01-circle.js";
import { inputRange } from "./components.js";

const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

// States
let draw = () => {};
const circleStates = {
  centerX: canvas.width / 2,
  centerY: canvas.height / 2,
  rad: 1000,
};

const control = document.getElementById("control");
const select = document.getElementById("select");
select.addEventListener("change", (e) => {
  const val = e.currentTarget.value;

  switch (val) {
    case "select":
      control.innerHTML = "";
      draw = () => clean(canvas, data);
      break;
    case "circle":
      const centerX = inputRange("Center X", 0, canvas.width);
      centerX.querySelector("input").addEventListener("change", (e) => {
        centerX.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
        circleStates.centerX = e.currentTarget.value;
      });
      const centerY = inputRange("Center Y", 0, canvas.height);
      centerY.querySelector("input").addEventListener("change", (e) => {
        centerY.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
        circleStates.centerY = e.currentTarget.value;
      });
      const rad = inputRange("Radius", 0, 2000);
      rad.querySelector("input").addEventListener("change", (e) => {
        rad.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
        circleStates.rad = e.currentTarget.value;
      });

      control.appendChild(centerX);
      control.appendChild(centerY);
      control.appendChild(rad);
      draw = () => drawCircle(canvas, data, circleStates);
      break;
  }
});

function render() {
  draw();
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(render);
}

render();
