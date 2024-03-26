<template>
    <div class="box">
        <div class="canvas-container">
            <canvas id="centerCanvas"></canvas>
        </div>
    </div>
</template>
<script setup>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, reactive, ref } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { ElLoading } from 'element-plus';

const loadingInstance = ref()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const showLoading = () => {
    loadingInstance.value = ElLoading.service({
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
};
const hideLoading = () => {
    loadingInstance.value.close();
};
const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader()
const objLoader = new OBJLoader()

const stuts = reactive({
    actions:[]
})
const sphericalGeometry = (url) =>{
  showLoading()
  const controls = new OrbitControls(camera.value, renderer.value.domElement);
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.zoomSpeed = 1.5;
  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);
  const texture = new THREE.TextureLoader().load(url);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  animateFunction(0)
  hideLoading()
}
//场景
const scene = new THREE.Scene()
const mesh = new URL(`@/assets/model/earth.glb`, import.meta.url).href

const gltfloading = (mesh) =>{
    gltfLoader.load(mesh, (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const maxSize = Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z);
        const targetSize = 5;
        const scale = targetSize / maxSize;
        model.scale.set(scale, scale, scale);
        scene.add(model);
        scene.add(new THREE.AmbientLight(0xffffff, 5))
        const controls = new OrbitControls(camera.value, renderer.value.domElement);
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        const mixer = new THREE.AnimationMixer(model);
        animateFunction(mixer,model)
    });
}

const generated = () =>{
    scene.background = new THREE.Color(0x000000);
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // 每个粒子有 x, y, z 三个坐标
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000; // x 坐标范围
        const y = Math.random() * 2000 - 1000; // y 坐标范围
        const z = Math.random() * 2000 - 1000; // z 坐标范围
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }   
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
}


// 动画循环
const animateFunction = (mixer,model) =>{
    function animate() {
        requestAnimationFrame(animate);
        if(mixer){
            mixer.update(0.01);
        }
        model.rotation.y += 0.01;
        renderer.value.render(scene, camera.value);
    }
    animate();
}





const canvas = ref()
const renderer = ref()
const camera = ref()
onMounted(()=>{
    canvas.value = document.getElementById("centerCanvas");
    renderer.value = new THREE.WebGLRenderer({ canvas: canvas.value ,preserveDrawingBuffer:true});
    renderer.value.setSize(600, 500)
    renderer.value.setClearColor(0xffffff,0);
    camera.value = new THREE.PerspectiveCamera(75, 600 / 500);
    camera.value.position.set(10,10,10); // 设置相机位置
    camera.value.lookAt(new THREE.Vector3(0, 0, 0));
    gltfloading(mesh)
    generated()
})
  
  
</script>
<style lang="scss" scoped>
    .box{
        width: 100%;
        height:100%;
        display: flex;
        background-image: url('../assets/images/pexels3.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        .canvas-container {
            overflow: hidden;
            width: 600px;
            height: 500px;
            margin: auto;
        }
    }
    .globe-container{
        margin:40px; 
        width: calc(100% - 80px);
        height:100%;
    }


</style>
  