export function getCellInfo(intersected,  length , height) {
    let HorisontalPartitionCount = localStorage.getItem('HorisontalPartitionCount')
    let VerticalPartitionCount = localStorage.getItem('VerticalPartitionCount')
    // Размеры ячеек
    const cellWidth = length / VerticalPartitionCount;
    const cellHeight = height / HorisontalPartitionCount;
    // Позиция точки пересечения
    const point = intersected.point;
    console.log(point)
    const cellX = Math.floor(point.x / cellWidth);
    const cellY = Math.floor(point.y / cellHeight);
    if (cellX >= 0 && cellX < VerticalPartitionCount && cellY >= 0 && cellY < HorisontalPartitionCount) {
        return { cellX, cellY, cellWidth, cellHeight };
    }
    return null; // Мышь не над ячейкой
}