import * as THREE from 'three'
import { scene } from './scene';



export const light2 = new THREE.AmbientLight('white', 0.5);
scene.add(light2);

const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(10, 20, 10);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.left = -25;
light.shadow.camera.right = 25;
light.shadow.camera.top = 25;
light.shadow.camera.bottom = -25;
light.shadow.camera.near = 1;
light.shadow.camera.far = 50;
scene.add(light);