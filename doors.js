import * as THREE from 'three'
import { doors } from "./scene";
import { config } from "./config";
import { textureMaterial , scene} from './scene';
import { addOutline } from './addOutline';
import { allcells } from './scene';

export function addDoor(saveNumberOfCell){  
    const cellWidth = config.cellWidth
    const cellHeight = config.cellHeight;
    const depth = config.depth
    let x = allcells[saveNumberOfCell].xp
    let y = allcells[saveNumberOfCell].yp
//  
    // if (doors[saveNumberOfCell]) {
    //     console.log('Door already exists at:', doorKey);
    //     return;
    // }
    const door = new THREE.Mesh(new THREE.BoxGeometry(cellWidth, cellHeight, 0.1), textureMaterial)
    addOutline(door)
    door.position.set(x, y ,depth);
    scene.add(door);
    doors.push({ NumberOfCell:saveNumberOfCell, mesh: door }); // Сохраняем дверь
}

export function addDoorDouble(saveNumberOfCell){  
    const cellWidth = config.cellWidth
    const cellHeight = config.cellHeight;
    const depth = config.depth
    let x = allcells[saveNumberOfCell].xp
    let y = allcells[saveNumberOfCell].yp

    const doorLeft = new THREE.Mesh(new THREE.BoxGeometry(cellWidth/2, cellHeight, 0.1), textureMaterial)
    const doorRight = new THREE.Mesh(new THREE.BoxGeometry(cellWidth/2, cellHeight, 0.1), textureMaterial)

    addOutline(doorLeft)
    addOutline(doorRight)

    doorLeft.position.set(x-cellWidth/4, y ,depth);
    doorRight.position.set(x+cellWidth/4, y ,depth);

    scene.add(doorLeft, doorRight);
    doors.push({ NumberOfCell:saveNumberOfCell, meshLeft: doorLeft, meshRight: doorRight }); // Сохраняем дверь
}









export function updateDoors() {
    const depth = config.depth
    const cellWidth = config.cellWidth
    const cellHeight = config.cellHeight;

    for (const doorKey of doors) {
        let numbercell = doorKey.NumberOfCell;
        const mesh = doorKey.mesh;
        mesh.geometry.dispose(); // Удаляем старую геометрию
        mesh.geometry = new THREE.BoxGeometry(cellWidth , cellHeight , 0.2); // Новая геометрия
        // Пересчитываем новую позицию двери
        mesh.position.set(
            allcells[numbercell].xp,
            allcells[numbercell].yp,
           
            depth
        );
    }
}

export function openAllDoors() {
    let newWidthCell = config.cellWidth
    for (const doorKey in doors) {
        const { mesh} = doors[doorKey];
        let posY = mesh.position.y
        let posX = mesh.position.x
        let posZ = mesh.position.z

        // Создаём группу для каждой двери, чтобы изменить точку вращения
        const doorGroup = new THREE.Group();
        // Добавляем дверь в группу
        doorGroup.add(mesh);
        mesh.position.set(newWidthCell/2, 0, 0); // Смещаем дверь влево относительно группы
        // Добавляем группу в сцену
        scene.add(doorGroup);
        doorGroup.position.set(posX-newWidthCell/2, posY, posZ); 
        doorGroup.rotation.y = - 45
    }
}

export function openDoorsDouble() {
    let newWidthCell = config.cellWidth
    for (const doorKey in doors) {
        const { mesh} = doors[doorKey];
        let posY = mesh.position.y
        let posX = mesh.position.x
        let posZ = mesh.position.z

        // Создаём группу для каждой двери, чтобы изменить точку вращения
        const doorGroup = new THREE.Group();
        // Добавляем дверь в группу
        doorGroup.add(mesh);
        mesh.position.set(newWidthCell/2, 0, 0); // Смещаем дверь влево относительно группы
        // Добавляем группу в сцену
        scene.add(doorGroup);
        doorGroup.position.set(posX-newWidthCell/2, posY, posZ); 
        doorGroup.rotation.y = - 45
    }
}

export function openAllDoubleDoors() {
    let newWidthCell = config.cellWidth; // Получаем ширину клетки
    for (const doorKey in doors) {
        const { meshLeft, meshRight } = doors[doorKey]; // Левые и правые двери

        // Получаем начальные позиции дверей
        let posY = meshLeft.position.y;
        let posXLeft = meshLeft.position.x;
        let posXRight = meshRight.position.x;
        let posZ = meshLeft.position.z;

        // Создаем группы для каждой двери, чтобы изменить точку вращения
        const doorGroupLeft = new THREE.Group();
        const doorGroupRight = new THREE.Group();

        // Добавляем двери в их соответствующие группы
        doorGroupLeft.add(meshLeft);
        doorGroupRight.add(meshRight);

        // Добавляем группы в сцену
        scene.add(doorGroupLeft);
        scene.add(doorGroupRight);

        // Смещаем двери относительно их групп, но так, чтобы они вращались вокруг края
        meshLeft.position.set(newWidthCell/4, 0, 0, 0, 0);  // Левую дверь смещаем относительно левого края
        meshRight.position.set(-newWidthCell/4, 0, 0, 0, 0); // Правую дверь смещаем относительно правого края

        // Возвращаем группы в их начальное положение, с учетом смещения
        doorGroupLeft.position.set(posXLeft-newWidthCell/4, posY, posZ);  // Левую группу на место
        doorGroupRight.position.set(posXRight+newWidthCell/4, posY, posZ); // Правую группу на место

        // Поворот дверей: левая дверь открывается влево, правая — вправо
        doorGroupLeft.rotation.y = -45;  // Левую дверь на -45 градусов
        doorGroupRight.rotation.y = 45;  // Правую дверь на 45 градусов
    }
}

export function closeAllDoubleDoors() {
    for (const doorKey in doors) {
        const { meshLeft, meshRight } = doors[doorKey]; // Левые и правые двери

        // Получаем группы для каждой двери
        const doorGroupLeft = meshLeft.parent;
        const doorGroupRight = meshRight.parent;

        doorGroupLeft.rotation.y =0 ;  // 
        doorGroupRight.rotation.y = 0;  // 

        
    }
}