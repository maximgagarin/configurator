import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export const scene = new THREE.Scene();
//export const axesHelper = new THREE.AxesHelper(30);
export const light = new THREE.AmbientLight('white', 0.5);
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement)

const texture = new THREE.TextureLoader().load('texture/wood.jpg')
const texture2 = new THREE.TextureLoader().load('texture/wood2.jpg')
const texture3 = new THREE.TextureLoader().load('texture/wood4.jpg')

export const textureMaterial = new THREE.MeshBasicMaterial({map: texture})
export const textureMaterial2 = new THREE.MeshBasicMaterial({map: texture2})
export const textureMaterial3 = new THREE.MeshBasicMaterial({map: texture3})


export function setup(){
    scene.add(light);
    camera.position.set(15, 5, 15);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper)
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 40;
    return controls
}
