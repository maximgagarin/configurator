export function getCellInfo(intersected, VerticalPartitionCount, HorisontalPartitionCount,  length , height) {
    // Размеры ячеек
    const cellWidth = length / VerticalPartitionCount;
    const cellHeight = height / HorisontalPartitionCount;
    // Позиция точки пересечения
    const point = intersected.point;
    const cellX = Math.floor(point.x / cellWidth);
    const cellY = Math.floor(point.y / cellHeight);
    if (cellX >= 0 && cellX < VerticalPartitionCount && cellY >= 0 && cellY < HorisontalPartitionCount) {
        return { cellX, cellY, cellWidth, cellHeight };
    }
    return null; // Мышь не над ячейкой
}