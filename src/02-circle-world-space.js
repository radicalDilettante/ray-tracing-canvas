import { inputRange } from "./components.js";

export class CircleWorldSpace {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.aspect = this.canvas.width / this.canvas.height;
    this.centerX = 0;
    this.centerY = 0;
    this.rad = 0.5;
    this.r = 255;
    this.g = 0;
    this.b = 0;
  }

  transformScreenToWorld(x, y) {
    const worldX =
      (x * 2 * this.aspect) / (this.canvas.width - 1) - this.aspect;
    const worldY = (y * -2) / (this.canvas.height - 1) + 1;
    return [worldX, worldY];
  }

  isInside(x, y, centerX, centerY, radius) {
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    return distance <= radius;
  }

  draw(data) {
    for (let i = 0; i < this.canvas.height * 4; i = i + 4) {
      for (let j = 0; j < this.canvas.width * 4; j = j + 4) {
        const r = this.canvas.width * i + j;
        const worldCoord = this.transformScreenToWorld(j / 4, i / 4);
        const inside = this.isInside(
          worldCoord[0],
          worldCoord[1],
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
    control.innerHTML = "";
    const centerX = inputRange(
      "Center X",
      -1 * this.aspect,
      1 * this.aspect,
      this.centerX,
      true
    );
    centerX.querySelector("input").addEventListener("input", (e) => {
      centerX.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.centerX = e.currentTarget.value;
    });
    const centerY = inputRange("Center Y", -1, 1, this.centerY, true);
    centerY.querySelector("input").addEventListener("input", (e) => {
      centerY.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.centerY = e.currentTarget.value;
    });
    const rad = inputRange("Radius", 0, 1, this.rad, true);
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
