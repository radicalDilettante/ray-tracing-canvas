import { inputRange } from "./components.js";
import * as vec3 from "./glmatrix/vec3.js";

export class Sphere {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.aspect = this.canvas.width / this.canvas.height;
    this.center = vec3.fromValues(0, 0, 0.5);
    this.rad = 0.4;
    this.color = vec3.fromValues(255, 255, 255);
  }

  transformScreenToWorld(x, y) {
    const xScale = 2 / (this.canvas.width - 1);
    const yScale = 2 / (this.canvas.height - 1);

    return vec3.fromValues(
      (x * xScale - 1) * this.aspect,
      -1 * (y * yScale) + 1,
      0
    );
  }

  IntersectRayCollision(start, dir) {
    const hit = {
      d: -1,
      point: vec3.fromValues(0, 0, 0),
      normal: vec3.fromValues(0, 0, 0),
    };

    const distanceToCenter = vec3.fromValues(
      start[0] - this.center[0],
      start[1] - this.center[1],
      start[2] - this.center[2]
    );

    const b = 2 * vec3.dot(dir, distanceToCenter);
    const c =
      vec3.dot(distanceToCenter, distanceToCenter) - this.rad * this.rad;
    const nabla = (b * b) / 4 - c;

    if (nabla >= 0) {
      const d1 = (-1 * b) / 2 + Math.sqrt(nabla);
      const d2 = (-1 * b) / 2 - Math.sqrt(nabla);
      hit.d = Math.min(d1, d2);
      hit.point = start + dir * hit.d;
      vec3.normalize(
        hit.normal,
        vec3.fromValues(
          hit.point[0] - this.center[0],
          hit.point[1] - this.center[1],
          hit.point[2] - this.center[2]
        )
      );
    }

    return hit;
  }

  traceRay(start, dir) {
    const hit = this.IntersectRayCollision(start, dir);
    if (hit.d < 0) {
      return vec3.fromValues(0, 0, 0);
    } else {
      return vec3.fromValues(
        this.color[0] * hit.d,
        this.color[1] * hit.d,
        this.color[2] * hit.d
      );
    }
  }

  draw(data) {
    for (let i = 0; i < this.canvas.height * 4; i = i + 4) {
      for (let j = 0; j < this.canvas.width * 4; j = j + 4) {
        const r = this.canvas.width * i + j;
        const worldCoord = this.transformScreenToWorld(j / 4, i / 4);

        const rayDir = vec3.fromValues(0, 0, 1);
        const color = this.traceRay(worldCoord, rayDir);
        data[r] = color[0];
        data[r + 1] = color[1];
        data[r + 2] = color[2];
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
      this.center[0],
      true
    );
    centerX.querySelector("input").addEventListener("input", (e) => {
      centerX.querySelector("span").innerHTML = ` (${parseFloat(
        e.currentTarget.value
      ).toFixed(2)})`;
      vec3.set(
        this.center,
        e.currentTarget.value,
        this.center[1],
        this.center[2]
      );
    });
    const centerY = inputRange("Center Y", -1, 1, this.center[1], true);
    centerY.querySelector("input").addEventListener("input", (e) => {
      centerY.querySelector("span").innerHTML = ` (${parseFloat(
        e.currentTarget.value
      ).toFixed(2)})`;
      vec3.set(
        this.center,
        this.center[0],
        e.currentTarget.value,
        this.center[2]
      );
    });
    const centerZ = inputRange("Center Z", 0, 1, this.center[2], true);
    centerZ.querySelector("input").addEventListener("input", (e) => {
      centerZ.querySelector("span").innerHTML = ` (${parseFloat(
        e.currentTarget.value
      ).toFixed(2)})`;
      vec3.set(
        this.center,
        this.center[0],
        this.center[1],
        e.currentTarget.value
      );
    });
    const rad = inputRange("Radius", 0, 1, this.rad, true);
    rad.querySelector("input").addEventListener("input", (e) => {
      rad.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      this.rad = e.currentTarget.value;
    });
    const r = inputRange("Red", 0, 255, this.color[0]);
    r.querySelector("input").addEventListener("input", (e) => {
      r.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.color, e.currentTarget.value, this.color[1], this.color[2]);
    });
    const g = inputRange("Green", 0, 255, this.color[1]);
    g.querySelector("input").addEventListener("input", (e) => {
      g.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.color, this.color[0], e.currentTarget.value, this.color[2]);
    });
    const b = inputRange("Blue", 0, 255, this.color[2]);
    b.querySelector("input").addEventListener("input", (e) => {
      b.querySelector("span").innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.color, this.color[0], this.color[1], e.currentTarget.value);
    });

    control.appendChild(centerX);
    control.appendChild(centerY);
    control.appendChild(centerZ);
    control.appendChild(rad);
    control.appendChild(r);
    control.appendChild(g);
    control.appendChild(b);
  }
}
