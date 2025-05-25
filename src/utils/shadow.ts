// Helper function for creating box shadows using Expo SDK 53 format
export const createBoxShadow = (
  color: string = "rgba(0, 0, 0, 0.3)",
  offsetX: number = 0,
  offsetY: number = 4,
  blurRadius: number = 8
) => {
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${color}`;
};
