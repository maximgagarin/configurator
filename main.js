import * as THREE from 'three'

import{scene,   camera, renderer, setup, textureMaterial, raycaster, mouse, doors ,allDrawers, drawerGroup, allcells} from './scene.js'


import { addOutline } from './addOutline.js';
import { modalInstance } from './controls.js';
import { config } from './config.js';
import { addDrawer , openAllDrawers, updateDrawers, closeAllDrawers, allPanels } from './addDrawer.js';
import { addDoor, updateDoors , openAllDoors, closeAllDoors} from './doors.js';
import { selectVal } from './controls.js';
import { searchObjectByCellInfo } from './searchObjectByCell.js';

import { gsap } from 'gsap';
import { cells } from './cells.js';


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

const closeDoorsButton = document.getElementById('closeDoorsButton');
closeDoorsButton.addEventListener('click', () => closeAllDoors());


// const openDoorsDoubleButton = document.getElementById('openDoorsDoubleButton');
// openDoorsDoubleButton.addEventListener('click', () => openAllDoubleDoors());


// const closeDoorsDoubleButton = document.getElementById('closeDoorsDoubleButton');
// closeDoorsDoubleButton.addEventListener('click', () => closeAllDoubleDoors());



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

let cellWidth = length / VerticalPartitionCount;
let cellHeight = height / HorisontalPartitionCount;
config.cellWidth = cellWidth
config.cellHeight = cellHeight


HorisontalPartitionGroup.castShadow = true
VerticalPartitionGroup.castShadow = true

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
    paneltop.position.set(0, height, depth / 2);
    panelbottom.position.set(0, 0, depth / 2);
    const panelleft = new THREE.Mesh(geometry, textureMaterial);
    const panelright = new THREE.Mesh(geometry, textureMaterial);
    panelleft.position.set(-length/2, height / 2, depth / 2);
    panelright.position.set(length/2, height / 2, depth / 2);
    panelback.position.set(0, height/2, -0.025);


    addOutline(panelbottom)
    addOutline(panelleft)
    addOutline(panelright)
    addOutline(paneltop)

    CellGroup.clear()

    panelleft.castShadow = true
    panelright.castShadow = true
    paneltop.castShadow = true
    panelbottom.castShadow = true
    panelback.castShadow = true

    panelleft.receiveShadow = true
    panelright.receiveShadow = true
    paneltop.receiveShadow = true
    panelbottom.receiveShadow = true
    panelback.receiveShadow = true


    
   
    panelGroup.add(panelleft, panelright, paneltop, panelbottom);
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
            horizontalPartition.position.set(xCenter-length/2, yLevel, depth / 2);
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
        vertPartition.position.set(xPos-length/2, height / 2, depth / 2);
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
            color: 'white',
            transparent: true,
            opacity: 0,
          })
        );
        transparentCube.position.set(((i + 0.5) * cellWidth)-length/2, (j + 0.5) * cellHeight, depth/2);
        let xp=((i + 0.5) * cellWidth)-length/2
        let yp = (j + 0.5) * cellHeight
        let zp = depth/2
      
        allcells.push({xp, yp ,zp})
        CellGroup.add(transparentCube);
      }
    }

    updateDoors()
    updateDrawers()
  
}


function onInputChange() {
    length = parseFloat(lengthInput.value);
    height = parseFloat(heightInput.value);
    depth = parseFloat(depthInput.value);

    HorisontalPartitionCount = parseFloat(horisontalCountInput.value);
    VerticalPartitionCount = parseFloat(verticalCountInput.value);

    cellWidth = length / VerticalPartitionCount;
    cellHeight = height / HorisontalPartitionCount;

    config.length = length
    config.height = height
    config.depth = depth
    config.HorisontalPartitionCount = HorisontalPartitionCount
    config.VerticalPartitionCount = VerticalPartitionCount 
    config.cellWidth = cellWidth
    config.cellHeight = cellHeight

    allcells.length=0
    

    panelBuilder( )

   // console.log(allcells)

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
    intersected.material.color.set('white');
    intersected.material.opacity = 0.2;
  }
});



window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allPanels); // Проверяем панели

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const parentGroup = intersected.parent; // Находим родительскую группу
        gsap.to(parentGroup.position, {
            z: config.depth / 2, // Открываем ящик вперед
            duration: 0.8,      // Длительность анимации
            ease: 'power2.inout', // Плавность
        });
    } else {
        // Возвращаем панели в исходное положение
        drawerGroup.children.forEach((group) => {
            gsap.to(group.position, {
                z: 0,            // Возвращаем на место
                duration: 2,   // Длительность анимации
                ease: 'power2.inout',
            });
        });
    }
});

// window.addEventListener('mousemove', (event) => {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObjects(AlldoorsGroup.children); // Проверяем панели

//     if (intersects.length > 0) {
//         const RotateGroup = new THREE.Group();
//         const intersected = intersects[0].object;
//         let posY = intersected.position.y
//         let posX = intersected.position.x
//         let posZ = intersected.position.z
//         intersected.position.set((config.cellWidth)/2, 0, 0); 
       
//         scene.add(RotateGroup);
//         RotateGroup.position.set(posX-(config.cellWidth)/2, posY, posZ); 
        
        
        
//         gsap.to(RotateGroup.rotation, { y: THREE.MathUtils.degToRad(-45), duration: 0.5 });
   
     
//     } else {
        
    
//     }
// });

let saveNumberOfCell

window.addEventListener('click', event =>{
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(CellGroup.children);
    if (intersects.length > 0) {
        const intersected = intersects[0];
        let x = intersected.object.position.x
        let y = intersected.object.position.y
       
        allcells.forEach((item, index)=>{
            if(item.xp == x && item.yp == y ){
                saveNumberOfCell = index
            }
        })
           searchObjectByCellInfo(saveNumberOfCell)
           modalInstance.show();
       
        
    } else {
       // console.log('123');
    }
})


function addToCell() {
  let selectValue = parseInt(selectVal.value); 
  //const Key = `${cellInfo.cellX}-${cellInfo.cellY}`;

  switch (selectValue) {
      case 1: // Добавляем дверь
          modalInstance.hide();
          const item1 = allDrawers.find(cell=> cell.NumberOfCell === saveNumberOfCell)?.group
          scene.remove(item1); // Удаляем ящик
          addDoor(saveNumberOfCell); // Добавляем дверь
         // console.log(doors)
        // console.log(doorGroup)
          break;
       

      case 2: // Добавляем ящик
        modalInstance.hide();
        let item2
        doors.forEach((cell, index) => {
            if (cell.NumberOfCell === saveNumberOfCell) {
                scene.remove(cell.mesh);
                doors.splice(index, 1); // Удаляем объект из массива
            }
        });
        
        console.log(doors)
          addDrawer(saveNumberOfCell, 3); // Добавляем ящик
          break;

      case 4: // Удаляем ящик и/или дверь
          modalInstance.hide();
        const item = doors.find(cell=> cell.NumberOfCell === saveNumberOfCell)?.type;

          break;
  }
}

//console.log(config)



onInputChange()



// let configuration = {
//     cellsDrawers: [
//         { cell: 0, numDrawers: 3 },
//         { cell: 1, numDrawers: 3 },
//         { cell: 2, numDrawers: 2 },
//         { cell: 3, numDrawers: 4 },
//     ],
//     cellsDoors: [
//         { cell: 4 },
//     ],

//     addDrawers:function(){
//         this.cellsDrawers.forEach(item => {
//             addDrawer( item.cell,  item.numDrawers );
//         });
//     },
//     addDoors:function(){
//         this.cellsDoors.forEach(item => {
//             addDoor( item.cell );
//         });
//     }
// };


//configuration.addDrawers()
//configuration.addDoors()


// // configuration.cells.forEach(item => {
// //     addDrawer({ cellX: item.cellX, cellY: item.cellY, numDrawers: item.numDrawers });
// // });


function animate() {
    requestAnimationFrame(animate);
   
     controls.update();
   
    renderer.render(scene, camera);
}
animate();