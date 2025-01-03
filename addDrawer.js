import * as THREE from 'three'
import { config } from './config';
import { allcells2, textureMaterial } from './scene';
import { allDrawers ,scene} from './scene';
import { addOutline } from './addOutline';
import { drawerGroup ,allcells } from './scene';
import { cells } from './cells';


export const allPanels = []; // Массив всех панелей

export function addDrawer(saveNumberOfCell, numDrawers) {
    const cellWidth = config.cellWidth;
    const cellHeight = config.cellHeight;
    const depth = config.depth;
   
    let cellX = allcells[saveNumberOfCell].xp
    let cellY = allcells[saveNumberOfCell].yp

    console.log(cellX , cellY)


    if (numDrawers < 1 || numDrawers > 5) {
        console.error("Количество ящиков должно быть от 1 до 5.");
        return;
    }

    const panels = [];
    const Group = new THREE.Group(); // Создание группы для ящиков

    const drawerHeight = (cellHeight / numDrawers)-0.02;

    for (let i = 0; i < numDrawers; i++) {
        const positionY = cellY + (i - (numDrawers - 1) / 2) * drawerHeight;

        // Создаём панели
        const frontpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth-0.1, drawerHeight, 0.1), textureMaterial);
        const leftpanel = new THREE.Mesh(new THREE.BoxGeometry(0.1, (drawerHeight - 0.1) * 0.9, depth - 0.2), textureMaterial);
        const rightpanel = new THREE.Mesh(new THREE.BoxGeometry(0.1, (drawerHeight - 0.1) * 0.9, depth - 0.2), textureMaterial);
        const bottompanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth - 0.4, 0.1, depth - 0.2), textureMaterial);
        const backpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth - 0.2, drawerHeight - 0.1, 0.2), textureMaterial);

        addOutline(frontpanel);
        addOutline(leftpanel);
        addOutline(rightpanel);
        addOutline(bottompanel);
        addOutline(backpanel);

        frontpanel.position.set(cellX, positionY, depth-0.1);
        leftpanel.position.set((cellX - cellWidth / 2)+0.1, positionY, depth / 2);
        rightpanel.position.set((cellX + cellWidth / 2)-0.1, positionY, depth / 2);
        bottompanel.position.set(cellX, positionY - drawerHeight / 2 + 0.2, depth / 2);
        backpanel.position.set(cellX, positionY, 0.2);

        // Добавляем панели в группу
        const Group2 = new THREE.Group();

        Group2.add(frontpanel, leftpanel, rightpanel, bottompanel, backpanel);
        drawerGroup.add(Group2);

        panels.push({ frontpanel, leftpanel, rightpanel, bottompanel, backpanel });

        allPanels.push(frontpanel)
    }

     // Добавляем группу в основную группу ящиков
    scene.add(drawerGroup); // Добавляем основную группу в сцену

    // Добавляем данные в массив allDrawers
    allDrawers.push({ NumberOfCell: saveNumberOfCell, panels: panels, group: drawerGroup });

    cells.push({Number: saveNumberOfCell, type:"drawer"})
    allcells2[saveNumberOfCell].type = 'drivers'
    //console.log(cells)
    console.log(allcells2)
}


export function updateDrawers() {

    //console.log(allcells)


     const cellWidth = config.cellWidth;
     const cellHeight = config.cellHeight;
     const depth = config.depth;

    

     for (let drawer of allDrawers) { // Изменено на "for...of" для доступа к объектам массива
        let panels = drawer.panels;
        let numDrawers =panels.length;
        let numbercell = drawer.NumberOfCell;
        const drawerHeight = cellHeight / numDrawers;
    
        for (let i = 0; i < numDrawers; i++) {
            // Здесь используется numbercell.xp и numbercell.yp для координат
            const positionY = allcells[numbercell].yp + (i - (numDrawers - 1) / 2) * drawerHeight;
            const { frontpanel, leftpanel, rightpanel, bottompanel, backpanel } = panels[i];
    
            // Обновление передней панели
            frontpanel.geometry.dispose();
            frontpanel.geometry = new THREE.BoxGeometry(cellWidth-0.1, drawerHeight, 0.1);
            frontpanel.position.set(allcells[numbercell].xp, positionY, depth-0.1);
            addOutline(frontpanel)
    
            
            // Обновляем левую панель
            leftpanel.geometry.dispose();
            leftpanel.geometry = new THREE.BoxGeometry(0.1, drawerHeight - 0.1, depth - 0.2);
            leftpanel.position.set((allcells[numbercell].xp-cellWidth/2)+0.1, positionY, depth / 2);
            addOutline(leftpanel)

            // Обновляем правую панель
            rightpanel.geometry.dispose();
            rightpanel.geometry = new THREE.BoxGeometry(0.1, drawerHeight - 0.1, depth - 0.2);
            rightpanel.position.set((allcells[numbercell].xp+cellWidth/2)-0.1, positionY, depth / 2);
            addOutline(rightpanel)

            // Обновляем нижнюю панель
            bottompanel.geometry.dispose();
            bottompanel.geometry = new THREE.BoxGeometry(cellWidth - 0.4, 0.1, depth - 0.2);
            bottompanel.position.set(allcells[numbercell].xp, (positionY - drawerHeight / 2)+0.2, depth / 2);
            addOutline(bottompanel)

            // Обновляем заднюю панель
            backpanel.geometry.dispose();
            backpanel.geometry = new THREE.BoxGeometry(cellWidth - 0.2, drawerHeight - 0.1, 0.2);
            backpanel.position.set(allcells[numbercell].xp, positionY, 0.2);
            addOutline(backpanel)



        }
    }





    // for (const drawerKey in allDrawers) {
    //     // const { group, panels, cellX, cellY } = allDrawers[drawerKey];
    //     // const numDrawers = panels.length; // Количество ящиков
    //     // const drawerHeight = cellHeight / numDrawers;



    //     for (let i = 0; i < numDrawers; i++) {
    //         const positionY = cellY + (i - (numDrawers - 1) / 2) * drawerHeight;

    //         const { frontpanel, leftpanel, rightpanel, bottompanel, backpanel } = panels[i];

    //         // Обновляем переднюю панель
    //         frontpanel.geometry.dispose();
    //         frontpanel.geometry = new THREE.BoxGeometry(cellWidth, drawerHeight, 0.1);
    //         leftpanel.position.set(cellX-cellWidth/2, positionY, depth / 2);
    //         addOutline(frontpanel)
            

    //         // Обновляем левую панель
    //         leftpanel.geometry.dispose();
    //         leftpanel.geometry = new THREE.BoxGeometry(0.2, drawerHeight - 0.1, depth - 0.2);
    //         leftpanel.position.set(cellX * cellWidth + 0.2, positionY, depth / 2);
    //         addOutline(leftpanel)

    //         // Обновляем правую панель
    //         rightpanel.geometry.dispose();
    //         rightpanel.geometry = new THREE.BoxGeometry(0.2, drawerHeight - 0.1, depth - 0.2);
    //         rightpanel.position.set((cellX + 1) * cellWidth - 0.2, positionY, depth / 2);
    //         addOutline(rightpanel)

    //         // Обновляем нижнюю панель
    //         bottompanel.geometry.dispose();
    //         bottompanel.geometry = new THREE.BoxGeometry(cellWidth - 0.4, 0.1, depth - 0.2);
    //         bottompanel.position.set((cellX + 0.5) * cellWidth, (positionY - drawerHeight / 2)+0.2, depth / 2);
    //         addOutline(bottompanel)

    //         // Обновляем заднюю панель
    //         backpanel.geometry.dispose();
    //         backpanel.geometry = new THREE.BoxGeometry(cellWidth - 0.2, drawerHeight - 0.1, 0.2);
    //         backpanel.position.set((cellX + 0.5) * cellWidth, positionY, 0.2);
    //         addOutline(backpanel)
    //     }
    // }
}



export function openAllDrawers() {
    const depthOffset = config.depth / 2; // Сдвиг по оси Z для открытия ящиков

    // Проходим по всем ящикам в allDrawers
    for (const drawer of allDrawers) {
        // Проверяем, если группа ящика существует
        if (drawer.group) {
            drawer.group.position.z = depthOffset;
        }
    }
}

export function closeAllDrawers() {
    for (const drawer of allDrawers) {
        if (drawer.group) {
            drawer.group.position.z = 0;
        }
    }
}


                

