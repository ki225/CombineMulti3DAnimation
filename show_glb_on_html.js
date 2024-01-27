//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const peopleURL = new URL('model3.glb',import.meta.url)

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);
document.body.appendChild(renderer.domElement)

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer.setClearColor(0xA3A3A3)
const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(10, 10, 10)
orbit.update()

const grid = new THREE.GridHelper(30,30)
scene.add(grid)

let mixer //可以修改，const不行

const assetLoader = new GLTFLoader()
assetLoader.load(peopleURL.href,function(gltf){
    const model = gltf.scene
    scene.add(model)
    mixer = new THREE.AnimationMixer(model)
    const clips = gltf.animations
    const clip = THREE.AnimationClip.findByName(clips, "Armature.001|mixamo.com|Layer0") //找到第一個動作 
    const action = mixer.clipAction(clip)
    action.play()

},undefined,function(error){
    console.log("errors found : " + error)
})


const clock = new THREE.Clock()

function animate(){
    requestAnimationFrame( animate );
    // Get the time elapsed since the last frame    
    if ( mixer !== undefined ) mixer.update( clock.getDelta() )    
    
    renderer.render(scene,camera)
}



renderer.setAnimationLoop(animate)

window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth/this.window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(this.window.innerWidth,this.window.innerHeight)
})

