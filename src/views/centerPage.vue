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
  // 鼠标操作旋转、缩放
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
//人物模型
const mesh = 'http://127.0.0.1:8080/file/home.glb'

const gltfloading = (mesh) =>{
    gltfLoader.load(mesh, (gltf) => {
        const model = gltf.scene;
        // // 将模型居中显示
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // 将模型移动到原点
        // 计算模型适合屏幕大小的缩放比例
        const maxSize = Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z);
        const targetSize = 11; // 设置模型期望的大小
        const scale = targetSize / maxSize;
        model.scale.set(scale, scale, scale);
        // 添加模型到场景中
        scene.add(model);
        scene.add(new THREE.AmbientLight(0xffffff, 5))
        // 鼠标操作旋转、缩放
        const controls = new OrbitControls(camera.value, renderer.value.domElement);
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        // 创建动画混合器
        const mixer = new THREE.AnimationMixer(model);
        traversal (mixer,gltf)
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
 
const traversal = (mixer,gltf) =>{
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        stuts.actions.push(action);
    });
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
    renderer.value.setSize(sizes.width, 500)
    renderer.value.setClearColor(0xffffff,0);
    camera.value = new THREE.PerspectiveCamera(75, sizes.width / 500);
    camera.value.position.set(10,10,10); // 设置相机位置
    camera.value.lookAt(new THREE.Vector3(0, 0, 0));
    // getImgesListData()
    gltfloading(mesh)
    generated()
})
  
  
</script>
<style lang="scss" scoped>
    .box{
        margin:40px; 
        width: calc(100% - 80px);
        height:500px;
        display: flex;
        .canvas-container {
            overflow: hidden;
            width: 100%;
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
  