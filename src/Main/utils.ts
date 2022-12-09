export function getMousePos(canvas: any, evt: any) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

export function clamp(value: number, max: number, min: number) {
  return Math.min(max, Math.max(min, value))
}

export function translateMatrix(value: number[], matrix: number[][]) {
  return matrix.map(el => {
    return [el[0] + value[0], el[1] + value[1]]
  })
}