import * as THREE from 'three'
import { config } from './config';
import { textureMaterial } from './scene';
import { allDrawers ,scene} from './scene';

let countGroup = 0

export function addDrawer({ cellX, cellY }){ 

    const cellWidth = config.cellWidth
    const cellHeight = config.cellHeight;
    const depth = config.depth

    const drawerKey = `${cellX}-${cellY}`;

    let positionY = cellHeight/3

        const frontpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth, cellHeight/3, 0.2), textureMaterial)
        const leftpanel = new THREE.Mesh(new THREE.BoxGeometry(0.2, cellHeight-0.4/3, depth-0.2), textureMaterial)
        const rightpanel = new THREE.Mesh(new THREE.BoxGeometry(0.2, cellHeight-0.4/3, depth-0.2), textureMaterial)
        const bottompanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth-0.4, 0.2, depth-0.2), textureMaterial);
        const backpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth-0.2, cellHeight-0.4/3, 0.2), textureMaterial);

        const drawerGroup = new THREE.Group(); // Создаем отдельную группу для ящика

        frontpanel.position.set(
            (cellX + 0.5) * cellWidth, 
            (cellY + 0.5) * cellHeight , 
            depth
        );
        // Позиция левой панели
        leftpanel.position.set(
            cellX * cellWidth+0.2, // Левый край ячейки
            (cellY + 0.5) * cellHeight-0.1, 
            depth / 2
        );
        // Позиция правой панели
        rightpanel.position.set(
            (cellX + 1) * cellWidth -0.2, // Правый край ячейки
            (cellY + 0.5) * cellHeight-0.1, 
            depth / 2
        );
        bottompanel.position.set(
            (cellX + 0.5) * cellWidth, // Центр ячейки по X
            cellY * cellHeight + 0.2,        // Нижний край ячейки по Y
            depth / 2                  // Глубина по Z
        );
        backpanel.position.set(
            (cellX + 0.5) * cellWidth, 
            (cellY + 0.5) * cellHeight-0.1, 
            0.2 // Задняя часть ячейки по Z
        );
        drawerGroup.add(frontpanel, leftpanel , rightpanel, bottompanel, backpanel);
        allDrawers[drawerKey] = {group: drawerGroup, frontpanel:frontpanel, leftpanel:leftpanel, rightpanel:rightpanel, bottompanel:bottompanel, backpanel:backpanel, cellX, cellY}
    
        scene.add(drawerGroup);  
}

export function openAllDrawers(){
    const depthOffset = config.depth / 2; // Сдвиг по оси Z для открытия ящиков

    // Проходим по всем ящикам в объекте allDrawers
    for (const key in allDrawers) {
        if (allDrawers.hasOwnProperty(key)) {
            const drawer = allDrawers[key];
            // Сдвигаем каждую группу ящика вперед
            drawer.group.position.z = depthOffset;
        }
    }
}

export function closeAllDrawers() {
    for (const key in allDrawers) {
        if (allDrawers.hasOwnProperty(key)) {
            const drawer = allDrawers[key];
            // Возвращаем каждую группу ящика на место
            drawer.group.position.z = 0;
        }
    }
}


export function updateDrawers() {

    const cellWidth = config.cellWidth
    const cellHeight = config.cellHeight;
    const depth = config.depth

    for (const drawerKey in allDrawers) {
        const { frontpanel, leftpanel, rightpanel, bottompanel, backpanel, cellX, cellY } = allDrawers[drawerKey];

        // Обновляем геометрию передней панели
        frontpanel.geometry.dispose();
        frontpanel.geometry = new THREE.BoxGeometry(cellWidth, cellHeight, 0.2);
        frontpanel.position.set(
            (cellX + 0.5) * cellWidth,
            (cellY + 0.5) * cellHeight,
            depth
        );

        // Обновляем геометрию левой панели
        leftpanel.geometry.dispose();
        leftpanel.geometry = new THREE.BoxGeometry(0.2, cellHeight - 0.4, depth);
        leftpanel.position.set(
            cellX * cellWidth + 0.2,
            (cellY + 0.5) * cellHeight - 0.1,
            depth / 2
        );

        // Обновляем геометрию правой панели
        rightpanel.geometry.dispose();
        rightpanel.geometry = new THREE.BoxGeometry(0.2, cellHeight - 0.4, depth);
        rightpanel.position.set(
            (cellX + 1) * cellWidth - 0.2,
            (cellY + 0.5) * cellHeight - 0.1,
            depth / 2
        );

        // Обновляем геометрию нижней панели
        bottompanel.geometry.dispose();
        bottompanel.geometry = new THREE.BoxGeometry(cellWidth - 0.4, 0.2, depth);
        bottompanel.position.set(
            (cellX + 0.5) * cellWidth,
            cellY * cellHeight + 0.2,
            depth / 2
        );

        // Обновляем геометрию задней панели
        backpanel.geometry.dispose();
        backpanel.geometry = new THREE.BoxGeometry(cellWidth - 0.2, cellHeight - 0.4, 0.2);
        backpanel.position.set(
            (cellX + 0.5) * cellWidth,
            (cellY + 0.5) * cellHeight - 0.1,
            0
        );
    }
   // console.log(allDrawers)
}
