<template>
  <canvas class="web3d"></canvas>、
  <button v-for="(item ,index) in actions" :key="index" class="floating-button"  @click="playAnimation(index)">{{ item }}1111</button>
  <button class="floating-button" @click="playAnimation(0)">{{ actions}}</button>
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ref } from 'vue'
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
const mesh = new URL(`@/assets/home.glb`, import.meta.url).href
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
const gltfloading = (mesh,camera,renderer) =>{
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
    new OrbitControls(camera, renderer.domElement);
    // 创建动画混合器
    const mixer = new THREE.AnimationMixer(model);
    // 获取动画数据并创建动作
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.reset().play();
        actions.push(action);
    });
    function animate() {
        requestAnimationFrame(animate);
        // 更新动画混合器
        mixer.update(0.01);
        renderer.render(scene, camera);
    }
    animate();
  });
}

onMounted(()=>{
  //获取画布元素
  const canvas = document.querySelector("canvas.web3d");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(sizes.width, sizes.height)
  renderer.setClearColor(0xffffff,0);
  // 添加相机
  const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height);
  camera.position.set(0,0,10); // 设置相机位置
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  gltfloading(mesh,camera,renderer)
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // 第一个参数是光的颜色，第二个参数是光的强度
  // directionalLight.position.set(0,0,10).normalize();
  // scene.add(directionalLight);
  // const textureLoader = new THREE.TextureLoader();
  // // 加载背景图片
  // const texture = textureLoader.load(bg);
  // // 纹理对象Texture赋值给场景对象的背景属性
  // scene.background = texture;

  // //添加人物模型到场景中
  // loader.load(mesh, (fbx) => {
  //   // 创建平行光源
  //   const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 第一个参数是光的颜色，第二个参数是光的强度
  //   // 设置光源的位置
  //   directionalLight.position.set(1, 1, 1).normalize();
  //   // 将平行光源添加到场景中
  //   scene.add(directionalLight);
  //   fbx.position.set(0,-8,0)
  //   fbx.scale.set(0.007, 0.007, 0.007)
  //   //鼠标操作旋转、缩放
  //   new OrbitControls(camera, renderer.domElement);
  //   scene.add(fbx)
  //   function animate (fbx){
  //     requestAnimationFrame(animate);
  //     if (fbx) {
  //       renderer.render(scene,camera)
  //     }
  //   }
  //   animate()
  // });
  
})


</script>
<style>
.floating-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.floating-button + .floating-button {
    top: 70px; /* 调整按钮之间的垂直间距 */
}
</style>
