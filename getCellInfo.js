import { config } from "./config";

export function getCellInfo(intersected,  length , height) {
    let HorisontalPartitionCount = config.HorisontalPartitionCount
    let VerticalPartitionCount = config.VerticalPartitionCount
    // Размеры ячеек
    const cellWidth = config.cellWidth
    const cellHeight = config.cellHeight
    // Позиция точки пересечения
    const point = intersected.point;
    console.log(point)
    const cellX = Math.floor(point.x / cellWidth);
    const cellY = Math.floor(point.y / cellHeight);
    if (cellX >= 0 && cellX < VerticalPartitionCount && cellY >= 0 && cellY < HorisontalPartitionCount) {
        return { cellX, cellY };
    }
    return null; // Мышь не над ячейкой
}