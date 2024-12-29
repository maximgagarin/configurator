import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export const scene = new THREE.Scene();
export const axesHelper = new THREE.AxesHelper(30);
export const light2 = new THREE.AmbientLight('white', 0.5);
export const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement)


renderer.shadowMap.enabled = true; // Включить тени
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 





export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();


const light = new THREE.DirectionalLight(0xffffff, 1);
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


const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);


const texture = new THREE.TextureLoader().load('texture/wood.jpg')
//const texture = new THREE.MeshStandardMaterial({ color: 'red' });

const texture2 = new THREE.TextureLoader().load('texture/wood2.jpg')
const texture3 = new THREE.TextureLoader().load('texture/wood4.jpg')

export const drawerGroup = new THREE.Group()
scene.add(drawerGroup)

export let allDrawers = {}
export const doors = {}


//export const textureMaterial = new THREE.MeshBasicMaterial({map: texture})
export const textureMaterial = new THREE.MeshStandardMaterial({ color: 'red' });



export const textureMaterial2 = new THREE.MeshBasicMaterial({map: texture2})
export const textureMaterial3 = new THREE.MeshBasicMaterial({map: texture3})



const floor = new THREE.Mesh(new THREE.BoxGeometry(60, 0.2 , 40), new THREE.MeshBasicMaterial({color:'white'}));
floor.receiveShadow = true
floor.position.set(0, -0.15 ,0)

const wall = new THREE.Mesh(new THREE.BoxGeometry(60, 30 , 0.2), new THREE.MeshBasicMaterial({color: '#42445A'}));
wall.receiveShadow = true
const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 30 , 30), new THREE.MeshBasicMaterial({color: '#42445A'}));
wallLeft.position.set(30, 0 , 15)

const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 30 , 30), new THREE.MeshBasicMaterial({color: '#42445A'}));
wallRight.position.set(-30, 0 , 15)


scene.add(floor, wall)

const container = document.getElementById('3d-container');


export function setup(){
    scene.add(light2);
    camera.position.set(10, 11, 30);
   
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper)
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 40;
    const canvas = renderer.domElement; 

    return controls
}
