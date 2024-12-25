import * as THREE from 'three'

import{scene,   camera, renderer, setup, textureMaterial, textureMaterial2, textureMaterial3} from './scene.js'
import { MouseMove } from './MouseMove.js';
import { getCellInfo } from './getCellInfo.js';
import { addOutline } from './addOutline.js';


const controls = setup()





const modalElement = document.getElementById('Modal');
const modalInstance = new bootstrap.Modal(modalElement);

const horisontalCountInput = document.getElementById('horisontalCountInput');
const verticalCountInput = document.getElementById('verticalCountInput');

const lengthInput = document.getElementById('length');
const heightInput = document.getElementById('height');
const depthInput = document.getElementById('depth');

lengthInput.addEventListener('input', onInputChange);
heightInput.addEventListener('input', onInputChange);
depthInput.addEventListener('input', onInputChange);

horisontalCountInput.addEventListener('input', onInputChange);
verticalCountInput.addEventListener('input', onInputChange);


let length = parseFloat(lengthInput.value) || 1;
let height = parseFloat(heightInput.value) || 1;
let depth = parseFloat(depthInput.value) || 1;

let HorisontalPartitionCount = parseFloat(horisontalCountInput.value);
let VerticalPartitionCount = parseFloat(verticalCountInput.value);

localStorage.setItem('HorisontalPartitionCount', HorisontalPartitionCount)
localStorage.setItem('VerticalPartitionCount', VerticalPartitionCount)






const drawerGroup = new THREE.Group()
scene.add(drawerGroup)
let allDrawers = {}
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const doors = {}

let panelGroup = new THREE.Group(); 
let doorsGroup = new THREE.Group(); 
let HorisontalPartitionGroup = new THREE.Group(); 
let VerticalPartitionGroup = new THREE.Group(); 
scene.add(HorisontalPartitionGroup, VerticalPartitionGroup, doorsGroup);

function panelBuilder(length, height ,depth){
    let HorisontalPartitionCount = localStorage.getItem('HorisontalPartitionCount')
    let VerticalPartitionCount = localStorage.getItem('VerticalPartitionCount')
    let widthCell = length/ VerticalPartitionCount
    localStorage.setItem('wcell', widthCell);
    scene.remove(panelGroup);
    panelGroup = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.2, height, depth);
    const paneltop = new THREE.Mesh(
        new THREE.BoxGeometry(length+0.2, 0.2, depth),
        textureMaterial
    );
    const panelbottom = new THREE.Mesh(
        new THREE.BoxGeometry(length+0.2, 0.2, depth),
        textureMaterial
    );
    const panelback = new THREE.Mesh(
        new THREE.BoxGeometry(length+0.2, height, 0.2),
        new THREE.MeshStandardMaterial({color: 'white'})
    );
    paneltop.position.set(length / 2, height, depth / 2);
    panelbottom.position.set(length / 2, 0, depth / 2);
    const panelleft = new THREE.Mesh(geometry, textureMaterial);
    const panelright = new THREE.Mesh(geometry, textureMaterial);
    panelleft.position.set(0, height / 2, depth / 2);
    panelright.position.set(length, height / 2, depth / 2);
    panelback.position.set(length/2, height/2, 0);


    addOutline(panelbottom)
    addOutline(panelleft)
    addOutline(panelright)
    addOutline(paneltop)

   
    panelGroup.add(panelleft, panelright, paneltop, panelbottom, panelback);
    HorisontalPartitionGroup.clear();
    for (let y = 1; y < HorisontalPartitionCount; y++) {
        const yLevel = (y * height) / HorisontalPartitionCount;
        for (let x = 0; x < VerticalPartitionCount; x++) {
            const xCenter = (x + 0.5) * (length / VerticalPartitionCount);
            const horizontalPartition = new THREE.Mesh(
                new THREE.BoxGeometry(length / VerticalPartitionCount, 0.2, depth),
                textureMaterial
            );
            addOutline(horizontalPartition)
            horizontalPartition.position.set(xCenter, yLevel, depth / 2);
            HorisontalPartitionGroup.add(horizontalPartition);
        }
    }
    VerticalPartitionGroup.clear();
    for (let x = 1; x < VerticalPartitionCount; x++) {
        const xPos = (x * length) / VerticalPartitionCount;
        const vertPartition = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, height, depth),
            textureMaterial
        );
        addOutline(vertPartition)
        vertPartition.position.set(xPos, height / 2, depth / 2);
        VerticalPartitionGroup.add(vertPartition);
    }

    scene.add(panelGroup);
    scene.add(HorisontalPartitionGroup);
    scene.add(VerticalPartitionGroup);
    updateDoors();
    updateDrawers()
}

function onInputChange() {
    length = parseFloat(lengthInput.value);
    height = parseFloat(heightInput.value);
    depth = parseFloat(depthInput.value);
    HorisontalPartitionCount = parseFloat(horisontalCountInput.value);
    VerticalPartitionCount = parseFloat(verticalCountInput.value);

    localStorage.HorisontalPartitionCount = HorisontalPartitionCount
    localStorage.VerticalPartitionCount = VerticalPartitionCount
    panelBuilder(length, height, depth )
    // const target = new THREE.Vector3(7, height/2, 5);
    // controls.target.copy(target);
}



window.addEventListener('click', event =>{
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        const intersected = intersects[0];
        const cellInfo = getCellInfo(intersected,   length , height)      
        if (cellInfo) {
            addDrawer(cellInfo);
        }
    } else {
        console.log('123');
    }
})

// Слушаем движение мыши
window.addEventListener('mousemove', (event) => MouseMove(camera, raycaster, mouse, event, scene,
      length , height, depth));


function addDoor({ cellX, cellY, cellWidth, cellHeight }){  
    const doorKey = `${cellX}-${cellY}`;
    if (doors[doorKey]) {
        console.log('Door already exists at:', doorKey);
        return;
    }
    const door = new THREE.Mesh(new THREE.BoxGeometry(cellWidth, cellHeight, 0.2), textureMaterial)
    addOutline(door)
    door.position.set(
        (cellX + 0.5) * cellWidth,
        (cellY + 0.5) * cellHeight,
        depth
    );
    scene.add(door);
    doors[doorKey] = { mesh: door, cellX, cellY }; // Сохраняем дверь
}


function updateDoors() {
    const cellWidth = length / VerticalPartitionCount;
    const cellHeight = height / HorisontalPartitionCount;

    for (const doorKey in doors) {
        const { mesh, cellX, cellY } = doors[doorKey];
        mesh.geometry.dispose(); // Удаляем старую геометрию
        mesh.geometry = new THREE.BoxGeometry(cellWidth , cellHeight , 0.2); // Новая геометрия
        // Пересчитываем новую позицию двери
        mesh.position.set(
            (cellX + 0.5) * cellWidth,
            (cellY + 0.5) * cellHeight,
            depth
        );
    }
}

function updateDrawers() {
    const cellWidth = length / VerticalPartitionCount;
    const cellHeight = height / HorisontalPartitionCount;

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
}



const openDoorsButton = document.getElementById('openDoorsButton');
openDoorsButton.addEventListener('click', () => openAllDoors());

const openDrawersButton = document.getElementById('openDrawersButton');
openDrawersButton.addEventListener('click', openAllDrawers);

function openAllDoors() {
    let newWidthCell = localStorage.getItem('wcell')
    for (const doorKey in doors) {
        const { mesh, cellX, cellY } = doors[doorKey];
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

function openAllDrawers(){
    drawerGroup.position.z = depth /2
}


function addDrawer({ cellX, cellY, cellWidth, cellHeight }){ 
    const drawerKey = `${cellX}-${cellY}`;
    const frontpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth, cellHeight, 0.2), textureMaterial)
    const leftpanel = new THREE.Mesh(new THREE.BoxGeometry(0.2, cellHeight-0.4, depth), textureMaterial)
    const rightpanel = new THREE.Mesh(new THREE.BoxGeometry(0.2, cellHeight-0.4, depth), textureMaterial)
    const bottompanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth-0.4, 0.2, depth), textureMaterial);
    const backpanel = new THREE.Mesh(new THREE.BoxGeometry(cellWidth-0.2, cellHeight-0.4, 0.2), textureMaterial);
    const addOutline = (mesh) => {
        const edges = new THREE.EdgesGeometry(mesh.geometry); // Создаем геометрию границ
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 })); // Линии для отображения
        mesh.add(line); // Добавляем контур в меш
    };

    // addOutline(frontpanel);
    // addOutline(leftpanel);
    // addOutline(rightpanel);
    // addOutline(bottompanel);
    // addOutline(backpanel);

    frontpanel.position.set(
        (cellX + 0.5) * cellWidth, 
        (cellY + 0.5) * cellHeight, 
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
        0 // Задняя часть ячейки по Z
    );
    drawerGroup.add(frontpanel, leftpanel , rightpanel, bottompanel, backpanel);
    allDrawers[drawerKey] = {frontpanel:frontpanel, leftpanel:leftpanel, rightpanel:rightpanel, bottompanel:bottompanel, backpanel:backpanel, cellX, cellY}
}
onInputChange()
function animate() {
    requestAnimationFrame(animate);
   
    // controls.update();
   
    renderer.render(scene, camera);
}
animate();