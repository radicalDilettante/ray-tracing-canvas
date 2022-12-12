export function clean(canvas, data) {
  for (let i = 0; i < canvas.height * 4; i = i + 4) {
    for (let j = 0; j < canvas.width * 4; j = j + 4) {
      const r = canvas.width * i + j;
      data[r] = 255;
      data[r + 1] = 255;
      data[r + 2] = 255;
      data[r + 3] = 255;
    }
  }
}
