
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// 允許相機在畫面中移動，使用者可以看到物體的不同視角
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// 用來導入 GLTF和 GLB
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const peopleURL = new URL('model3.glb',import.meta.url)

//建立渲染器，大小設定跟畫面一樣大
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//把渲染器加到 DOM
document.getElementById("container3D").appendChild(renderer.domElement);
document.body.appendChild(renderer.domElement)

// 建立場景
const scene = new THREE.Scene();
//建立相機並調整角度和位置
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer.setClearColor(0xA3A3A3)
const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(10, 10, 10)
orbit.update()

const grid = new THREE.GridHelper(30,30)
scene.add(grid)

let mixer //let宣告的變數可以修改，const不行

//讀入 glb / gltf 檔案
const assetLoader = new GLTFLoader()
assetLoader.load(peopleURL.href,function(gltf){
    const model = gltf.scene
    scene.add(model)
    mixer = new THREE.AnimationMixer(model)
    const move_clips = gltf.animations
    console.log(gltf) //從這裡可以看到檔案裡面的資訊，包含我們的animation array(也就是 pose library)
    const move1_clip = THREE.AnimationClip.findByName(move_clips, "Armature.001|mixamo.com|Layer0") //找到第一個動作 
    const move1_action = mixer.clipAction(move1_clip)
    move1_action.play()
    move1_action.loop = THREE.LoopOnce //跑一次就好

    const move2_clip = THREE.AnimationClip.findByName(move_clips, "Armature.002|mixamo.com|Layer0") //找到第一個動作 
    const move2_action = mixer.clipAction(move2_clip)
    move2_action.play()
    move2_action.loop = THREE.LoopOnce //跑一次就好

    // 此範例是兩個動作交替
    mixer.addEventListener('finished',function(e){
        if(e.action._clip.name === "Armature.001|mixamo.com|Layer0"){
            move2_action.reset()
            move2_action.play()
        }else if(e.action._clip.name === "Armature.002|mixamo.com|Layer0"){
            move1_action.reset()
            move1_action.play()
        }
        //window.alert("Animation has finished")
    })
},undefined,function(error){
    console.log("errors found : " + error)
})


// 循環展示動作
const clock = new THREE.Clock()
function animate(){
    requestAnimationFrame( animate );
    // Get the time elapsed since the last frame    
    if ( mixer !== undefined ) mixer.update( clock.getDelta() )    
    renderer.render(scene,camera)
}

renderer.setAnimationLoop(animate)

// 使用者的相機可以改變看物體的視角
window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth/this.window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(this.window.innerWidth,this.window.innerHeight)
})

