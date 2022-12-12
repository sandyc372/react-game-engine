import { ICanvasNode } from './canvasDom';

export class CanvasTreeRenderer {
  root: ICanvasNode;
  canvasRef: any;

  constructor(canvasRef: any, root: ICanvasNode) {
    this.root = root;
    this.canvasRef = canvasRef;
  }

  commit = () => {
    this.render();
  }

  renderNode = (node: ICanvasNode) => {
    node.children.forEach(el => this.renderNode(el));

    if (node.nodeName === 'canvastext') {
      this.renderText(node);
    }

    if (node.nodeName === 'canvascircle') {
      this.renderCircle(node)
    }

    if (node.nodeName === 'canvasrect') {
      this.renderRect(node)
    }

    if (node.nodeName === 'canvasline') {
      this.renderLine(node)
    }

    if (node.nodeName === 'canvasimage') {
      this.renderImage(node)
    }
  }

  renderText = (node: ICanvasNode) => {
    let ctx = this.canvasRef.getContext('2d');
    const { content, point, textAlign = 'left', textBaseline = 'middle', font = '10px sans-serif', maxWidth = undefined, fill = 'black', stroke = 'transparent' } = node.attributes;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = font;
    ctx.fillText(content, point[0], point[1], maxWidth);
  }

  renderCircle = (node: ICanvasNode) => {
    let ctx = this.canvasRef.getContext('2d');
    const { fill = 'transparent', stroke = 'black', strokeWeight = 1, x = 0, y = 0, r = 10 } = node.attributes;

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWeight;

    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  renderRect = (node: ICanvasNode) => {
    let ctx = this.canvasRef.getContext('2d');
    const { fill = 'transparent', stroke = 'black', strokeWeight = 1, x = 0, y = 0, width = 10, height = 10 } = node.attributes;

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWeight;

    ctx.beginPath();
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
    ctx.closePath();
  }

  renderLine = (node: ICanvasNode) => {
    let ctx = this.canvasRef.getContext('2d');
    const { stroke = 'black', strokeWeight = 1, x1 = 0, y1 = 0, x2 = 10, y2 = 10 } = node.attributes;

    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWeight;

    ctx.beginPath(); // Start a new path
    ctx.moveTo(x1, y1); // Move the pen to (30, 50)
    ctx.lineTo(x2, y2); // Draw a line to (150, 100)
    ctx.stroke(); // Render the path
  }

  renderImage = (node: ICanvasNode) => {
    let ctx = this.canvasRef.getContext('2d');
    const { image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight } = node.attributes;
    ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  }

  render = () => {
    let ctx = this.canvasRef.getContext('2d');
    ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
    this.renderNode(this.root)
  }
}