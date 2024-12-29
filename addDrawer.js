import * as THREE from 'three'
import { config } from './config';
import { textureMaterial } from './scene';
import { allDrawers ,scene} from './scene';
import { addOutline } from './addOutline';
import { drawerGroup } from './scene';

export const allPanels = []; // Массив всех панелей

export function addDrawer({ cellX, cellY, numDrawers = 3}) {
    const cellWidth = config.cellWidth;
    const cellHeight = config.cellHeight;
    const depth = config.depth;

    const drawerKey = `${cellX}-${cellY}`;

    // Ограничение на количество ящиков (от 1 до 5)
    if (numDrawers < 1 || numDrawers > 5) {
        console.error("Количество ящиков должно быть от 1 до 5.");
        return;
    }
    const panels = []; 

    // Высота для каждого ящика
    const drawerHeight = cellHeight / numDrawers;
    // Смещение для размещения ящиков внутри ячейки
    for (let i = 0; i < numDrawers; i++) {
        // Позиция Y для каждого ящика с учетом количества
        let positionY = (cellY + 0.5) * cellHeight + (i - (numDrawers - 1) / 2) * drawerHeight;
        const Group = new THREE.Group()
        // Создаем панели для ящика
        const frontpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth, drawerHeight, 0.1), textureMaterial);
        const leftpanel = new THREE.Mesh(new THREE.BoxGeometry(0.2, (drawerHeight - 0.1)*0.9, depth - 0.2), textureMaterial);
        const rightpanel = new THREE.Mesh(new THREE.BoxGeometry(0.2, (drawerHeight - 0.1)*0.9, depth - 0.2), textureMaterial);
        const bottompanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth - 0.4, 0.1, depth - 0.2), textureMaterial);
        const backpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth - 0.2, drawerHeight - 0.1, 0.2), textureMaterial);

        addOutline(frontpanel)
        addOutline(leftpanel)
        addOutline(rightpanel)
        addOutline(bottompanel)
        addOutline(backpanel)

     
        frontpanel.position.set((cellX + 0.5) * cellWidth, positionY, depth-0.1);
      
        leftpanel.position.set(cellX * cellWidth + 0.2, positionY, depth / 2);
      
        rightpanel.position.set((cellX + 1) * cellWidth - 0.2, positionY, depth / 2);
     
        bottompanel.position.set((cellX + 0.5) * cellWidth, (positionY - drawerHeight / 2)+0.2, depth / 2);
      
        backpanel.position.set((cellX + 0.5) * cellWidth, positionY, 0.2);

        Group.add(frontpanel, leftpanel, rightpanel, bottompanel, backpanel );
        drawerGroup.add(Group)

        panels.push({ frontpanel, leftpanel, rightpanel, bottompanel, backpanel });

        allPanels.push(frontpanel); 
        
        scene.add(drawerGroup);
        allDrawers[drawerKey] = { group: drawerGroup, panels, cellX, cellY };
    }
}


export function updateDrawers() {
    const cellWidth = config.cellWidth;
    const cellHeight = config.cellHeight;
    const depth = config.depth;

    for (const drawerKey in allDrawers) {
        const { group, panels, cellX, cellY } = allDrawers[drawerKey];
        const numDrawers = panels.length; // Количество ящиков
        const drawerHeight = cellHeight / numDrawers;

        for (let i = 0; i < numDrawers; i++) {
            const positionY = (cellY + 0.5) * cellHeight + (i - (numDrawers - 1) / 2) * drawerHeight;

            const { frontpanel, leftpanel, rightpanel, bottompanel, backpanel } = panels[i];

            // Обновляем переднюю панель
            frontpanel.geometry.dispose();
            frontpanel.geometry = new THREE.BoxGeometry(cellWidth, drawerHeight, 0.2);
            frontpanel.position.set((cellX + 0.5) * cellWidth, positionY, depth);
            addOutline(frontpanel)
            

            // Обновляем левую панель
            leftpanel.geometry.dispose();
            leftpanel.geometry = new THREE.BoxGeometry(0.2, drawerHeight - 0.1, depth - 0.2);
            leftpanel.position.set(cellX * cellWidth + 0.2, positionY, depth / 2);
            addOutline(leftpanel)

            // Обновляем правую панель
            rightpanel.geometry.dispose();
            rightpanel.geometry = new THREE.BoxGeometry(0.2, drawerHeight - 0.1, depth - 0.2);
            rightpanel.position.set((cellX + 1) * cellWidth - 0.2, positionY, depth / 2);
            addOutline(rightpanel)

            // Обновляем нижнюю панель
            bottompanel.geometry.dispose();
            bottompanel.geometry = new THREE.BoxGeometry(cellWidth - 0.4, 0.1, depth - 0.2);
            bottompanel.position.set((cellX + 0.5) * cellWidth, (positionY - drawerHeight / 2)+0.2, depth / 2);
            addOutline(bottompanel)

            // Обновляем заднюю панель
            backpanel.geometry.dispose();
            backpanel.geometry = new THREE.BoxGeometry(cellWidth - 0.2, drawerHeight - 0.1, 0.2);
            backpanel.position.set((cellX + 0.5) * cellWidth, positionY, 0.2);
            addOutline(backpanel)
        }
    }
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


                

