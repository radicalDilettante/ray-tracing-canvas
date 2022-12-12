import { clean } from "./00-clean.js";
import { drawCircle } from "./01-circle.js";

const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

const select = document.getElementById("select");
select.addEventListener("change", (e) => {
  const val = e.currentTarget.value;
  console.log(val);

  switch (val) {
    case "select":
      clean(canvas, data);
      break;
    case "circle":
      drawCircle(canvas, data);
      break;
  }

  ctx.putImageData(imageData, 0, 0);
});
