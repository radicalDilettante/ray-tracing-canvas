export function drawCircle(canvas, data, circleStates) {
  for (let i = 0; i < canvas.height * 4; i = i + 4) {
    for (let j = 0; j < canvas.width * 4; j = j + 4) {
      const r = canvas.width * i + j;
      const inside = isInside(
        i,
        j,
        circleStates.centerX,
        circleStates.centerY,
        circleStates.rad
      );
      data[r] = 255;
      data[r + 1] = inside ? 0 : 255;
      data[r + 2] = inside ? 0 : 255;
      data[r + 3] = 255;
    }
  }
}

function isInside(x, y, centerX, centerY, radius) {
  const distance = Math.sqrt(
    Math.pow(x - centerY * 4, 2) + Math.pow(y - centerX * 4, 2)
  );
  return distance <= radius;
}
