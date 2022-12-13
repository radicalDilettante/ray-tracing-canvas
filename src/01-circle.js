import { inputRange } from "./components.js";

export class Circle {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.rad = 500;
    this.r = 255;
    this.g = 0;
    this.b = 0;
  }

  isInside(x, y, centerX, centerY, radius) {
    const distance = Math.sqrt(
      Math.pow(x - centerY * 4, 2) + Math.pow(y - centerX * 4, 2)
    );
    return distance <= radius;
  }

  draw(data) {
    for (let i = 0; i < this.canvas.height * 4; i = i + 4) {
      for (let j = 0; j < this.canvas.width * 4; j = j + 4) {
        const r = this.canvas.width * i + j;
        const inside = this.isInside(
          i,
          j,
          this.centerX,
          this.centerY,
          this.rad
        );
        data[r] = inside ? this.r : 255;
        data[r + 1] = inside ? this.g : 255;
        data[r + 2] = inside ? this.b : 255;
        data[r + 3] = 255;
      }
    }
  }

  addControl() {
    const control = document.getElementById("control");

    const centerX = inputRange("Center X", 0, canvas.width, this.centerX);
    centerX.querySelector("input").addEventListener("input", (e) => {
      centerX.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.centerX = e.currentTarget.value;
    });
    const centerY = inputRange("Center Y", 0, canvas.height, this.centerY);
    centerY.querySelector("input").addEventListener("input", (e) => {
      centerY.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.centerY = e.currentTarget.value;
    });
    const rad = inputRange("Radius", 0, 2000, this.rad);
    rad.querySelector("input").addEventListener("input", (e) => {
      rad.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.rad = e.currentTarget.value;
    });
    const r = inputRange("Red", 0, 255, this.r);
    r.querySelector("input").addEventListener("input", (e) => {
      r.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.r = e.currentTarget.value;
    });
    const g = inputRange("Green", 0, 255, this.g);
    g.querySelector("input").addEventListener("input", (e) => {
      g.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.g = e.currentTarget.value;
    });
    const b = inputRange("Blue", 0, 255, this.b);
    b.querySelector("input").addEventListener("input", (e) => {
      b.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.b = e.currentTarget.value;
    });

    control.appendChild(centerX);
    control.appendChild(centerY);
    control.appendChild(rad);
    control.appendChild(r);
    control.appendChild(g);
    control.appendChild(b);
  }
}
