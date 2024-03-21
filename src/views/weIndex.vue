<template>
    <div class="canvas-container">
        <canvas class="web3d" style="width: 100%;height: 100%;"></canvas>
    </div>
    <div class="carousel">
        <el-carousel :autoplay="false" :interval="4000" type="card" height="150px" @change="carouselChange">
            <el-carousel-item v-for="item in data.imges" :key="item" style="background-color: azure;">
                <!-- <img :src="item.url" style="width: 300px;height: 150px;"> -->
                <el-image
                    style="width: 300px; height: 150px"
                    :src="item.url"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="data.imges"
                    :initial-index="4"
                    fit="cover"
                />
                <!-- <button @click="screenshot">downloading</button> -->
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
<script setup>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, reactive } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { getImgesList } from '../api/index'
import { ref } from 'vue'
import { ElLoading } from 'element-plus';
const loadingInstance = ref()
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
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
//读取fbx
const loader = new FBXLoader();
//读取gltf
const gltfLoader = new GLTFLoader()
//场景
const scene = new THREE.Scene()
//人物模型
// const mesh = new URL(`@/assets/SwingDancing.fbx`, import.meta.url).href
// const mesh = new URL(`@/assets/home.glb`, import.meta.url).href

const mesh = 'http://127.0.0.1:8080/file/home.glb'
// const bg = new URL(`@/assets/bg.jpg`, import.meta.url).href
// 动画数组
const actions = [];

// 函数来触发动画播放
const playAnimation = (index) => {
    if (actions[index]) {
        const action = actions[index];
        if (action) {
            action.reset().play();
            action.setLoop(THREE.LoopOnce, 1); // 设置为只播放一次
            // 监听动画完成事件并停止动画
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            action.enabled = true;
            action.play();
            action.onFinish = () => {
            // 恢复模型到最初状态
            action.reset();
            action.stop();
            };
        } else {
            console.error('Action is not defined');
        }
    } else {
        console.error('Action index out of bounds');
    }
};

const gltfloading = (mesh) =>{
    gltfLoader.load(mesh, (gltf) => {
        const model = gltf.scene;
        // // 将模型居中显示
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // 将模型移动到原点
        // 计算模型适合屏幕大小的缩放比例
        const maxSize = Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z);
        const targetSize = 2; // 设置模型期望的大小
        const scale = targetSize / maxSize;
        model.scale.set(scale, scale, scale);
        // 添加模型到场景中
        scene.add(model);
        scene.add(new THREE.AmbientLight(0xffffff, 5))
        // 鼠标操作旋转、缩放
        const controls = new OrbitControls(camera.value, renderer.value.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.minDistance = 100;
        controls.maxDistance = 500;
        // 创建动画混合器
        const mixer = new THREE.AnimationMixer(model);
        traversal (mixer,gltf)
        animateFunction(mixer)
    });
}

const sphericalGeometry = (url) =>{
    showLoading()
    // 鼠标操作旋转、缩放
    const controls = new OrbitControls(camera.value, renderer.value.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader().load(url);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    animateFunction(0)
    hideLoading()
}

const traversal = (mixer,gltf) =>{
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.reset().play();
        actions.push(action);
    });
}

const screenshot = (name) =>{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const img = renderer.value.domElement.toDataURL('image/jpg')
    const a = document.createElement('a');
    a.href = img;
    a.download = `${currentTime}-${name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 动画循环
const animateFunction = (mixer) =>{
    function animate() {
        requestAnimationFrame(animate);
        if(mixer){
            mixer.update(0.01);
        }
        renderer.value.render(scene, camera.value);
    }
    animate();
}
 
const carouselChange = (val) => {
    sphericalGeometry(data.imges[val].url)
}

function convertVRToBase64() {
    const temporaryScene = new THREE.Scene();
    const temporaryCamera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer:true });
    // 创建一个环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 光颜色为白色，光强度为0.5
    temporaryScene.add(ambientLight);
    renderer.setSize(200, 150);
    renderer.render(temporaryScene, temporaryCamera);
    const dataUrl = renderer.domElement.toDataURL('image/jpg');
    return dataUrl;
}
const data = reactive({
    imges:[]
})
const getImgesListData = async () => {
    const res = await getImgesList();
    if (res.status === 200) {
        data.imges = await Promise.all(
            res.data.map(async (item) => {
                const url = 'http://127.0.0.1:8080/file/' + item;
                const base64Url = await convertVRToBase64(url);
                return { base64Url: base64Url, url: url };
            })
        );
        sphericalGeometry(data.imges[0].url)
    }
};
const canvas = ref()
const renderer = ref()
const camera = ref()
onMounted(()=>{
    canvas.value = document.querySelector("canvas.web3d");
    renderer.value = new THREE.WebGLRenderer({ canvas: canvas.value ,preserveDrawingBuffer:true});
    renderer.value.setSize(sizes.width, sizes.height)
    renderer.value.setClearColor(0xffffff,0);
    camera.value = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.value.position.set(10,10,10); // 设置相机位置
    camera.value.lookAt(new THREE.Vector3(0, 0, 0));
    // getImgesListData()
    gltfloading(mesh,camera,renderer)
    // 在计算属性中使用 data.imges[0] 来确保异步数据已经加载完毕
})
  
  
  </script>
<style>
    .canvas-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .carousel{
        position: absolute;
        bottom:  20px;
        width: 600px;
        height: 300px;
        left: calc(50% - 300px);
    }
    
</style>
  