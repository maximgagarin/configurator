import * as THREE from 'three'

export const addOutline = (mesh) => {
    const edges = new THREE.EdgesGeometry(mesh.geometry); // Создаем геометрию границ
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 'grey' })); // Линии для отображения
    mesh.add(line); // Добавляем контур в меш
};