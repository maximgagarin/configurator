import * as THREE from 'three'
import { textureMaterial } from './scene'
import { addOutline } from './addOutline'

let HorisontalPartitionGroup = new THREE.Group(); 
let VerticalPartitionGroup = new THREE.Group(); 

export function panelBuilder(length, height ,depth, scene, panelGroup){
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


    // addOutline(panelbottom)
    // addOutline(panelleft)
    // addOutline(panelright)
    // addOutline(paneltop)

   
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
            // addOutline(horizontalPartition)
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
        // addOutline(vertPartition)
        vertPartition.position.set(xPos, height / 2, depth / 2);
        VerticalPartitionGroup.add(vertPartition);
    }

    scene.add(panelGroup);
    scene.add(HorisontalPartitionGroup);
    scene.add(VerticalPartitionGroup);
    updateDoors();
    updateDrawers()
}