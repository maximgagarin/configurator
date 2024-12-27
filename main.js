import * as THREE from 'three'

import{scene,   camera, renderer, setup, textureMaterial, raycaster, mouse, doors ,allDrawers} from './scene.js'

import { getCellInfo } from './getCellInfo.js';
import { addOutline } from './addOutline.js';
import { modalInstance } from './controls.js';
import { config } from './config.js';
import { addDrawer , openAllDrawers, updateDrawers, closeAllDrawers} from './addDrawer.js';
import { addDoor, updateDoors , openAllDoors} from './doors.js';
import { selectVal } from './controls.js';
import { searchObjectByCellInfo } from './funk.js';



const controls = setup()
const canvas = renderer.domElement; 


const horisontalCountInput = document.getElementById('horisontalCountInput');
const verticalCountInput = document.getElementById('verticalCountInput');
const lengthInput = document.getElementById('length');
const heightInput = document.getElementById('height');
const depthInput = document.getElementById('depth');
const modalButton = document.getElementById('ModalButton');



lengthInput.addEventListener('input', onInputChange);
heightInput.addEventListener('input', onInputChange);
depthInput.addEventListener('input', onInputChange);
modalButton.addEventListener('click', addToCell )

horisontalCountInput.addEventListener('input', onInputChange);
verticalCountInput.addEventListener('input', onInputChange);

const openDoorsButton = document.getElementById('openDoorsButton');
openDoorsButton.addEventListener('click', () => openAllDoors());

const openDrawersButton = document.getElementById('openDrawersButton');
openDrawersButton.addEventListener('click', openAllDrawers);

const closeDrawersButton = document.getElementById('closeDrawersButton');
closeDrawersButton.addEventListener('click', closeAllDrawers);





let length = parseFloat(lengthInput.value) || 1;
let height = parseFloat(heightInput.value) || 1;
let depth = parseFloat(depthInput.value) || 1;


let HorisontalPartitionCount = parseFloat(horisontalCountInput.value);
let VerticalPartitionCount = parseFloat(verticalCountInput.value);

const CellGroup = new THREE.Group();
scene.add(CellGroup);

let panelGroup = new THREE.Group(); 
let doorsGroup = new THREE.Group(); 
let HorisontalPartitionGroup = new THREE.Group(); 
let VerticalPartitionGroup = new THREE.Group(); 
scene.add(HorisontalPartitionGroup, VerticalPartitionGroup, doorsGroup);

function panelBuilder(){
    let HorisontalPartitionCount = config.HorisontalPartitionCount
    let VerticalPartitionCount = config.VerticalPartitionCount
    const cellWidth = config.cellWidth
    const cellHeight = config.cellHeight;
    scene.remove(panelGroup);
    panelGroup = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.1, height-0.1, depth);
    const paneltop = new THREE.Mesh(
        new THREE.BoxGeometry(length+0.1, 0.1, depth),
        textureMaterial
    );
    const panelbottom = new THREE.Mesh(
        new THREE.BoxGeometry(length+0.1, 0.1, depth),
        textureMaterial
    );
    const panelback = new THREE.Mesh(
        new THREE.BoxGeometry(length+0.2, height, 0.05),
        new THREE.MeshStandardMaterial({color: 'white'})
    );
    paneltop.position.set(length / 2, height, depth / 2);
    panelbottom.position.set(length / 2, 0, depth / 2);
    const panelleft = new THREE.Mesh(geometry, textureMaterial);
    const panelright = new THREE.Mesh(geometry, textureMaterial);
    panelleft.position.set(0, height / 2, depth / 2);
    panelright.position.set(length, height / 2, depth / 2);
    panelback.position.set(length/2, height/2, -0.025);


    // addOutline(panelbottom)
    // addOutline(panelleft)
    // addOutline(panelright)
    // addOutline(paneltop)

    CellGroup.clear()
   
    panelGroup.add(panelleft, panelright, paneltop, panelbottom, panelback);
    HorisontalPartitionGroup.clear();
    for (let y = 1; y < HorisontalPartitionCount; y++) {
        const yLevel = (y * height) / HorisontalPartitionCount;
        for (let x = 0; x < VerticalPartitionCount; x++) {
            const xCenter = (x + 0.5) * (length / VerticalPartitionCount);
            const horizontalPartition = new THREE.Mesh(
                new THREE.BoxGeometry(length / VerticalPartitionCount -0.12, 0.1, depth),
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
            new THREE.BoxGeometry(0.1, height-0.1, depth),
            textureMaterial
        );
        addOutline(vertPartition)
        vertPartition.position.set(xPos, height / 2, depth / 2);
        VerticalPartitionGroup.add(vertPartition);
    }
    scene.add(panelGroup);
    scene.add(HorisontalPartitionGroup);
    scene.add(VerticalPartitionGroup);

    
    for (let i = 0; i < VerticalPartitionCount; i++) {
      for (let j = 0; j < HorisontalPartitionCount; j++) {
        const transparentCube = new THREE.Mesh(
          new THREE.BoxGeometry(cellWidth, cellHeight, depth),
          new THREE.MeshBasicMaterial({
            color: 'green',
            transparent: true,
            opacity: 0,
          })
        );
        transparentCube.position.set((i + 0.5) * cellWidth, (j + 0.5) * cellHeight, depth/2);
        CellGroup.add(transparentCube);
      }
    }

    updateDoors();
    updateDrawers()
}

function onInputChange() {
    length = parseFloat(lengthInput.value);
    height = parseFloat(heightInput.value);
    depth = parseFloat(depthInput.value);

    HorisontalPartitionCount = parseFloat(horisontalCountInput.value);
    VerticalPartitionCount = parseFloat(verticalCountInput.value);

    const cellWidth = length / VerticalPartitionCount;
    const cellHeight = height / HorisontalPartitionCount;

    config.length = length
    config.height = height
    config.depth = depth
    config.HorisontalPartitionCount = HorisontalPartitionCount
    config.VerticalPartitionCount = VerticalPartitionCount 
    config.cellWidth = cellWidth
    config.cellHeight = cellHeight

    panelBuilder( )

    const target = new THREE.Vector3(7, height/2, 5);
    controls.target.copy(target); //камера смотрит на target
}

let cellInfo

window.addEventListener('mousemove', (event ) => {
  // Нормализация координат мыши
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(CellGroup.children);

  // Сбрасываем все прозрачные кубы в исходное состояние
  CellGroup.children.forEach((cube) => {
    cube.material.color.set('green');
    cube.material.opacity = 0;
  });

  // Если есть пересечение, изменяем параметры пересекаемого объекта
  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    intersected.material.color.set('green');
    intersected.material.opacity = 0.2;
  }
});

window.addEventListener('click', event =>{
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(CellGroup.children);
    if (intersects.length > 0) {
        const intersected = intersects[0];
        cellInfo = getCellInfo(intersected,   length , height)  
         
        if (cellInfo) {
           searchObjectByCellInfo(cellInfo)
          modalInstance.show() 
        }
    } else {
       // console.log('123');
    }
})


function addToCell() {
  let selectValue = parseInt(selectVal.value); 
  const Key = `${cellInfo.cellX}-${cellInfo.cellY}`;

  switch (selectValue) {
      case 1: // Добавляем дверь
          modalInstance.hide();
          const existingDrawer = allDrawers[Key]; // Проверяем, есть ли ящик в этой ячейке
          if (existingDrawer) {
              scene.remove(existingDrawer.group); // Удаляем ящик
              delete allDrawers[Key]; // Удаляем ящик из объекта allDrawers
          }
          addDoor(cellInfo); // Добавляем дверь
          break;

      case 2: // Добавляем ящик
          modalInstance.hide();
          const existingDoor = doors[Key]; // Проверяем, есть ли дверь в этой ячейке
          if (existingDoor) {
              scene.remove(existingDoor.mesh); // Удаляем дверь
              delete doors[Key]; // Удаляем дверь из объекта doors
          }
          addDrawer(cellInfo); // Добавляем ящик
          break;

      case 4: // Удаляем ящик и/или дверь
          modalInstance.hide();
          const drawer = allDrawers[Key];
          const door = doors[Key];

          if (drawer) {
              scene.remove(drawer.group); // Удаляем ящик
              delete allDrawers[Key]; // Удаляем ящик из объекта allDrawers
          }

          if (door) {
              scene.remove(door.mesh); // Удаляем дверь
              delete doors[Key]; // Удаляем дверь из объекта doors
          }
          break;
  }
}

onInputChange()

function animate() {
    requestAnimationFrame(animate);
   
     controls.update();
   
    renderer.render(scene, camera);
}
animate();