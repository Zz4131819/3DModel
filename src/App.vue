<template>
  <canvas class="web3d"></canvas>
</template>
<script setup>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
const mesh = new URL(`@/assets/sx.gltf`, import.meta.url).href
const bg = new URL(`@/assets/bg.jpg`, import.meta.url).href
onMounted(()=>{
  //获取画布元素
  const canvas = document.querySelector("canvas.web3d");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  const textureLoader = new THREE.TextureLoader();
  // 加载背景图片
  const texture = textureLoader.load(bg);
  // 纹理对象Texture赋值给场景对象的背景属性
  scene.background = texture;
  renderer.setSize(sizes.width, sizes.height)
  // 添加相机
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 15;
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
  gltfLoader.load(mesh, (gltf) => {
    gltf.scene.traverse((child) => {
	    if (child.isMesh) {
	      child.material.side = THREE.DoubleSide; // 模型双面渲染
	      child.castShadow = false;  // 光照是否有阴影
	      child.receiveShadow = false;  // 是否接收阴影
	      child.frustumCulled = false;
        child.material.clearcoatRoughness = 0
        child.material.roughness = 1
        child.material.iridescenceIOR = 0
	    }
	  });
    const model = gltf.scene;
    // 将模型居中显示
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); // 将模型移动到原点
    // 计算模型适合屏幕大小的缩放比例
    const maxSize = Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z);
    const targetSize = 10; // 设置模型期望的大小
    const scale = targetSize / maxSize;
    model.scale.set(scale, scale, scale);
    // 将模型放置到屏幕中心
    model.position.set(0, -sizes.height/200, 0);
    // 添加模型到场景中
    scene.add(model);
    // 添加八个平行灯
    const directionalLights = [];
    const lightIntensity = 16;
    const distance = 10;
    
    for (let i = 0; i < 8; i++) {
        const directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
        const angle = Math.PI / 4 * i;
        const x = Math.sin(angle);
        const z = Math.cos(angle);

        if (i < 4) {
            directionalLight.position.set(x, 1, z).normalize().multiplyScalar(distance);
        } else {
            directionalLight.position.set(x, -1, z).normalize().multiplyScalar(distance);
        }

        scene.add(directionalLight);
        directionalLights.push(directionalLight);
    }
    // 鼠标操作旋转、缩放
    new OrbitControls(camera, renderer.domElement);
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
  });
})


</script>
<style>

</style>
