import { Skia, SkPath } from "@shopify/react-native-skia";

interface PathCommand {
  command: string;
  params: number[];
}

export const svgToSkiaPath = (
  svgPathData: string,
  width?: number,
  height?: number
): SkPath => {
  const path = Skia.Path.Make();

  // Clean and parse the SVG path data
  const commands = parseSvgPath(svgPathData);

  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  for (const { command, params } of commands) {
    switch (command.toLowerCase()) {
      case "m": // Move to
        if (command === "M") {
          currentX = params[0];
          currentY = params[1];
        } else {
          currentX += params[0];
          currentY += params[1];
        }
        path.moveTo(currentX, currentY);
        startX = currentX;
        startY = currentY;
        break;

      case "l": // Line to
        if (command === "L") {
          currentX = params[0];
          currentY = params[1];
        } else {
          currentX += params[0];
          currentY += params[1];
        }
        path.lineTo(currentX, currentY);
        break;

      case "h": // Horizontal line
        if (command === "H") {
          currentX = params[0];
        } else {
          currentX += params[0];
        }
        path.lineTo(currentX, currentY);
        break;

      case "v": // Vertical line
        if (command === "V") {
          currentY = params[0];
        } else {
          currentY += params[0];
        }
        path.lineTo(currentX, currentY);
        break;

      case "c": // Cubic Bézier curve
        if (command === "C") {
          path.cubicTo(
            params[0],
            params[1],
            params[2],
            params[3],
            params[4],
            params[5]
          );
          currentX = params[4];
          currentY = params[5];
        } else {
          path.cubicTo(
            currentX + params[0],
            currentY + params[1],
            currentX + params[2],
            currentY + params[3],
            currentX + params[4],
            currentY + params[5]
          );
          currentX += params[4];
          currentY += params[5];
        }
        break;

      case "q": // Quadratic Bézier curve
        if (command === "Q") {
          path.quadTo(params[0], params[1], params[2], params[3]);
          currentX = params[2];
          currentY = params[3];
        } else {
          path.quadTo(
            currentX + params[0],
            currentY + params[1],
            currentX + params[2],
            currentY + params[3]
          );
          currentX += params[2];
          currentY += params[3];
        }
        break;

      case "z": // Close path
        path.close();
        currentX = startX;
        currentY = startY;
        break;
    }
  }

  // Scale the path if dimensions are provided
  if (width && height) {
    const bounds = path.getBounds();
    const scaleX = width / bounds.width;
    const scaleY = height / bounds.height;

    const matrix = Skia.Matrix();
    matrix.scale(scaleX, scaleY);
    path.transform(matrix);
  }

  return path;
};

const parseSvgPath = (pathData: string): PathCommand[] => {
  const commands: PathCommand[] = [];
  const commandRegex = /[MmLlHhVvCcSsQqTtAaZz]/g;

  let match;
  let lastIndex = 0;

  while ((match = commandRegex.exec(pathData)) !== null) {
    if (lastIndex !== 0) {
      const paramString = pathData.slice(lastIndex, match.index).trim();
      const params = parseNumbers(paramString);
      commands.push({
        command: pathData[lastIndex - 1],
        params,
      });
    }
    lastIndex = match.index + 1;
  }

  // Handle the last command
  if (lastIndex < pathData.length) {
    const paramString = pathData.slice(lastIndex).trim();
    const params = parseNumbers(paramString);
    commands.push({
      command: pathData[lastIndex - 1],
      params,
    });
  }

  return commands;
};

const parseNumbers = (str: string): number[] => {
  if (!str) return [];
  return str
    .replace(/,/g, " ")
    .split(/\s+/)
    .filter((s) => s.length > 0)
    .map(Number);
};
