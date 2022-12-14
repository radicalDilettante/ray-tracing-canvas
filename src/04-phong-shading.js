import { inputRange } from "./components.js";
import * as vec3 from "./glmatrix/vec3.js";

export class PhongShading {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.aspect = this.canvas.width / this.canvas.height;
    this.center = vec3.fromValues(0, 0, 0.5);
    this.rad = 0.4;
    // this.color = vec3.fromValues(255, 255, 255);
    this.amb = vec3.fromValues(0, 0, 0);
    this.diff = vec3.fromValues(0, 0, 255);
    this.spec = vec3.fromValues(255, 255, 255);
    this.alpha = 9;
    this.ks = 0.8;

    this.light = vec3.fromValues(0, 0, -1);
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
      hit.point = vec3.fromValues(
        start[0] + dir[0] * hit.d,
        start[1] + dir[1] * hit.d,
        start[2] + dir[2] * hit.d
      );

      start + dir * hit.d;
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
      // Diffuse
      const dirToLight = vec3.create();
      vec3.normalize(
        dirToLight,
        vec3.fromValues(
          this.light[0] - hit.point[0],
          this.light[1] - hit.point[1],
          this.light[2] - hit.point[2]
        )
      );
      const diff = Math.max(vec3.dot(hit.normal, dirToLight), 0);

      // Specular
      const i = 2 * vec3.dot(hit.normal, dirToLight);
      const reflectDir = vec3.fromValues(
        hit.normal[0] * i - dirToLight[0],
        hit.normal[1] * i - dirToLight[1],
        hit.normal[2] * i - dirToLight[2]
      );
      const specular = Math.pow(
        Math.max(
          vec3.dot(
            vec3.fromValues(dir[0] * -1, dir[1] * -1, dir[2] * -1),
            reflectDir
          ),
          0
        ),
        this.alpha
      );

      return vec3.fromValues(
        this.amb[0] + this.diff[0] * diff + this.spec[0] * specular * this.ks,
        this.amb[1] + this.diff[1] * diff + this.spec[1] * specular * this.ks,
        this.amb[2] + this.diff[2] * diff + this.spec[2] * specular * this.ks
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

    const lightX = inputRange("Light X", -2, 2, this.light[0], true);
    lightX.querySelector("input").addEventListener("input", (e) => {
      lightX.querySelector("span").innerHTML = ` (${parseFloat(
        e.currentTarget.value
      ).toFixed(2)})`;
      vec3.set(this.light, e.currentTarget.value, this.light[1], this.light[2]);
    });
    const lightY = inputRange("Light Y", -2, 2, this.light[1], true);
    lightY.querySelector("input").addEventListener("input", (e) => {
      lightY.querySelector("span").innerHTML = ` (${parseFloat(
        e.currentTarget.value
      ).toFixed(2)})`;
      vec3.set(this.light, this.light[0], e.currentTarget.value, this.light[2]);
    });
    const lightZ = inputRange("Light Z", -2, 2, this.light[2], true);
    lightZ.querySelector("input").addEventListener("input", (e) => {
      lightZ.querySelector("span").innerHTML = ` (${parseFloat(
        e.currentTarget.value
      ).toFixed(2)})`;
      vec3.set(this.light, this.light[0], this.light[1], e.currentTarget.value);
    });

    const ambientRed = inputRange("Ambient Red", 0, 255, this.amb[0]);
    ambientRed.querySelector("input").addEventListener("input", (e) => {
      ambientRed.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.amb, e.currentTarget.value, this.amb[1], this.amb[2]);
    });
    const ambientGreen = inputRange("Ambient Green", 0, 255, this.amb[1]);
    ambientGreen.querySelector("input").addEventListener("input", (e) => {
      ambientGreen.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.amb, this.amb[0], e.currentTarget.value, this.amb[2]);
    });
    const ambientBlue = inputRange("Ambient Blue", 0, 255, this.amb[2]);
    ambientBlue.querySelector("input").addEventListener("input", (e) => {
      ambientBlue.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.amb, this.amb[0], this.amb[1], e.currentTarget.value);
    });

    const diffuseRed = inputRange("Diffuse Red", 0, 255, this.diff[0]);
    diffuseRed.querySelector("input").addEventListener("input", (e) => {
      diffuseRed.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.diff, e.currentTarget.value, this.diff[1], this.diff[2]);
    });
    const diffuseGreen = inputRange("Diffuse Green", 0, 255, this.diff[1]);
    diffuseGreen.querySelector("input").addEventListener("input", (e) => {
      diffuseGreen.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.diff, this.diff[0], e.currentTarget.value, this.diff[2]);
    });
    const diffuseBlue = inputRange("Diffuse Blue", 0, 255, this.diff[2]);
    diffuseBlue.querySelector("input").addEventListener("input", (e) => {
      diffuseBlue.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.diff, this.diff[0], this.diff[1], e.currentTarget.value);
    });

    const specularRed = inputRange("Specular Red", 0, 255, this.spec[0]);
    specularRed.querySelector("input").addEventListener("input", (e) => {
      specularRed.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.spec, e.currentTarget.value, this.spec[1], this.spec[2]);
    });
    const specularGreen = inputRange("Specular Green", 0, 255, this.spec[1]);
    specularGreen.querySelector("input").addEventListener("input", (e) => {
      specularGreen.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.spec, this.spec[0], e.currentTarget.value, this.spec[2]);
    });
    const specularBlue = inputRange("Specular Blue", 0, 255, this.spec[2]);
    specularBlue.querySelector("input").addEventListener("input", (e) => {
      specularBlue.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      vec3.set(this.spec, this.spec[0], this.spec[1], e.currentTarget.value);
    });

    const specularPower = inputRange("Specular Power", 0, 100, this.alpha);
    specularPower.querySelector("input").addEventListener("input", (e) => {
      specularPower.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      this.alpha = e.currentTarget.value;
    });

    const specularCoeff = inputRange("Specular Coeff", 0, 1, this.ks, true);
    specularCoeff.querySelector("input").addEventListener("input", (e) => {
      specularCoeff.querySelector(
        "span"
      ).innerHTML = ` (${e.currentTarget.value})`;
      this.ks = e.currentTarget.value;
    });

    control.appendChild(centerX);
    control.appendChild(centerY);
    control.appendChild(centerZ);
    control.appendChild(rad);
    control.appendChild(lightX);
    control.appendChild(lightY);
    control.appendChild(lightZ);
    control.appendChild(ambientRed);
    control.appendChild(ambientGreen);
    control.appendChild(ambientBlue);
    control.appendChild(diffuseRed);
    control.appendChild(diffuseGreen);
    control.appendChild(diffuseBlue);
    control.appendChild(specularRed);
    control.appendChild(specularGreen);
    control.appendChild(specularBlue);
    control.appendChild(specularPower);
    control.appendChild(specularCoeff);
  }
}
