export function drawCircle(canvas, data) {
  for (let i = 0; i < canvas.height * 4; i = i + 4) {
    for (let j = 0; j < canvas.width * 4; j = j + 4) {
      const r = canvas.width * i + j;
      const inside = isInside(i, j, canvas.height * 2, canvas.width * 2, 800);
      data[r] = 255;
      data[r + 1] = inside ? 0 : 255;
      data[r + 2] = inside ? 0 : 255;
      data[r + 3] = 255;
    }
  }
}

function isInside(x, y, centerX, centerY, radius) {
  const distance = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  );
  return distance <= radius;
}
