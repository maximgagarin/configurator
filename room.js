import * as THREE from 'three'




const texture = new THREE.TextureLoader().load('texture/plitka2.jpg')
const textureLoader = new THREE.TextureLoader();


const diffuseMap2 = textureLoader.load('texture/Color.jpg'); // Цвет
const normalMap2 = textureLoader.load('texture/normal.jpg'); // Нормали
const displacementMap2 = textureLoader.load('texture/Displacement.jpg');

// const diffuseMap = textureLoader.load('texture/colorwood.jpg'); // Цвет
// const normalMap = textureLoader.load('texture/normalwod.jpg'); // Нормали
// const displacementMap = textureLoader.load('texture/diswood.jpg');

// const diffuseMap = textureLoader.load('texture/color1.jpg'); // Цвет
// const normalMap = textureLoader.load('texture/normal1.jpg'); // Нормали
// const displacementMap = textureLoader.load('texture/dis1.jpg');

const diffuseMap = textureLoader.load('texture/colorbriks.jpg'); // Цвет
const normalMap = textureLoader.load('texture/normalbriks.jpg'); // Нормали
const displacementMap = textureLoader.load('texture/disbriks.jpg');

// const diffuseMap = textureLoader.load('texture/colorbriks2.jpg'); // Цвет
// const normalMap = textureLoader.load('texture/normalbriks2.jpg'); // Нормали
// const displacementMap = textureLoader.load('texture/disbriks2.jpg');

// const diffuseMap = textureLoader.load('texture/colorblackbriks.jpg'); // Цвет
// const normalMap = textureLoader.load('texture/normalblackbriks.jpg'); // Нормали
// const displacementMap = textureLoader.load('texture/disblackbriks.jpg');


// const diffuseMap2 = textureLoader.load('texture/colorwoodfloor.jpg'); // Цвет
// const normalMap2 = textureLoader.load('texture/normalwoodfloor.jpg'); // Нормали
// const displacementMap2 = textureLoader.load('texture/diswoodfloor.jpg');

// const diffuseMap = textureLoader.load('texture/colormetal.jpg'); // Цвет
// const normalMap = textureLoader.load('texture/normalmetal.jpg'); // Нормали
// const displacementMap = textureLoader.load('texture/dismetal.jpg');




diffuseMap.wrapS = THREE.RepeatWrapping;
diffuseMap.wrapT = THREE.RepeatWrapping;
diffuseMap.repeat.set(5, 5); // Количество повторений текстуры по ширине и высоте

normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;
normalMap.repeat.set(5, 5);

displacementMap2.wrapS = THREE.RepeatWrapping;
displacementMap2.wrapT = THREE.RepeatWrapping;
displacementMap2.repeat.set(5, 5);

diffuseMap2.wrapS = THREE.RepeatWrapping;
diffuseMap2.wrapT = THREE.RepeatWrapping;
diffuseMap2.repeat.set(5, 5); // Количество повторений текстуры по ширине и высоте

normalMap2.wrapS = THREE.RepeatWrapping;
normalMap2.wrapT = THREE.RepeatWrapping;
normalMap2.repeat.set(5, 5);

displacementMap2.wrapS = THREE.RepeatWrapping;
displacementMap2.wrapT = THREE.RepeatWrapping;
displacementMap2.repeat.set(5, 5);

const tileMaterial = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    normalMap: normalMap,
    displacementMap: displacementMap,
    displacementScale: 0.1, // Интенсивность эффекта высоты
  });

  const tileMaterialfloor = new THREE.MeshStandardMaterial({
    map: diffuseMap2,
    normalMap: normalMap2,
    displacementMap: displacementMap2,
    displacementScale: 0.1, // Интенсивность эффекта высоты
  });






export const floor = new THREE.Mesh(new THREE.BoxGeometry(30, 0.2 , 30),tileMaterialfloor ); //new THREE.MeshStandardMaterial({color:'white'})
floor.receiveShadow = true
floor.castShadow = true
floor.position.set(5, -0.2 ,0)

export const wall = new THREE.Mesh(new THREE.BoxGeometry(30, 30 , 0.2), tileMaterial); //#42445A
wall.position.x =5
wall.position.z =-0.2

wall.receiveShadow = true
wall.castShadow = true




const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 30 , 30), new THREE.MeshStandardMaterial({color: '#42445A'}));
wallLeft.position.set(30, 0 , 15)
wallLeft.castShadow = true
wallLeft.receiveShadow = true


const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 30 , 30), new THREE.MeshStandardMaterial({color: '#42445A'}));
wallRight.position.set(-30, 0 , 15)
