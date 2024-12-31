import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const scene = new THREE.Scene();
export const axesHelper = new THREE.AxesHelper(30);
// export const light2 = new THREE.AmbientLight('white', 0.1);
export const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement)
import { floor , wall } from './room';
import { light, light2 , helper} from './light';


renderer.shadowMap.enabled = true; // Включить тени
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setClearColor(0xffffff, 1);


export let allDrawers = []
export let doors = []
export let allcells = []
export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();

scene.add(floor, wall)
scene.add(helper, light, light2);




const texture = new THREE.TextureLoader().load('texture/wood.jpg')
//const texture = new THREE.MeshStandardMaterial({ color: 'red' });

const texture2 = new THREE.TextureLoader().load('texture/wood2.jpg')
const texture3 = new THREE.TextureLoader().load('texture/wood4.jpg')

export const drawerGroup = new THREE.Group()
scene.add(drawerGroup)


//export const textureMaterial = new THREE.MeshStandardMaterial({map: texture3})
export const textureMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
export const textureMaterial2 = new THREE.MeshBasicMaterial({map: texture2})
export const textureMaterial3 = new THREE.MeshBasicMaterial({map: texture3})




const container = document.getElementById('3d-container');


export function setup(){
    
    camera.position.set(10, 11, 30);
   
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper)
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 7;
    controls.maxDistance = 50;
    const canvas = renderer.domElement; 
    // controls.minPolarAngle = Math.PI / 4; // Минимальный угол (пример: 45 градусов)
    // controls.maxPolarAngle = Math.PI / 2; // Максимальный угол (пример: 90 градусов)

    // controls.minAzimuthAngle = -Math.PI / 4; // Минимальный угол (пример: -45 градусов)
    // controls.maxAzimuthAngle = Math.PI / 4;  // Максимальный угол (пример: 45 градусов)

    // // Дополнительные настройки
    // controls.enableDamping = true; // Добавление инерции
    // controls.dampingFactor = 0.05;

    return controls
}
