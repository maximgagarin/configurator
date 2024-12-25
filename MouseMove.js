import * as THREE from 'three'
import { getCellInfo } from './getCellInfo.js';
let highlightedCell = null;


export function MouseMove(camera, raycaster, mouse, event, scene, VerticalPartitionCount, HorisontalPartitionCount,  length , height, depth) {
    // Нормализуем координаты мыши
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // Используем Raycaster для определения пересечения
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const intersected = intersects[0];
        const cellInfo = getCellInfo(intersected, VerticalPartitionCount, HorisontalPartitionCount,  length , height);
        if (cellInfo) {
            highlightCell(cellInfo, scene, depth);
        }
    } else {
        removeHighlight(scene);
    }
}


function highlightCell({ cellX, cellY, cellWidth, cellHeight }, scene, depth) {
    // Если ячейка уже подсвечена, не нужно ничего делать
    if (highlightedCell && highlightedCell.cellX === cellX && highlightedCell.cellY === cellY) {
        return;
    }

    // Удаляем предыдущее выделение
    removeHighlight(scene);

    const highlightMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const highlightGeometry = new THREE.BoxGeometry(cellWidth, cellHeight, depth);
    const highlightEdges = new THREE.EdgesGeometry(highlightGeometry);

    const highlightMesh = new THREE.LineSegments(highlightEdges, highlightMaterial);
    highlightMesh.position.set(
        (cellX + 0.5) * cellWidth,
        (cellY + 0.5) * cellHeight,
        depth / 2
    );
    scene.add(highlightMesh);
    highlightedCell = { cellX, cellY, mesh: highlightMesh };
}

function removeHighlight(scene) {
    if (highlightedCell) {
        scene.remove(highlightedCell.mesh);
        highlightedCell = null;
    }
}