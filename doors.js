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