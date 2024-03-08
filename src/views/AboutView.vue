<template>
  <canvas class="web3d"></canvas>
</template>
<script setup>
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted } from 'vue';
const sizes = {
  width: 800,
  height: 600,
};
//读取fbx
const loader = new FBXLoader();
//场景
const scene = new THREE.Scene()
//人物模型
const mesh = new URL(`@/assets/SwingDancing.fbx`, import.meta.url).href
onMounted(()=>{
  //获取画布元素
  const canvas = document.querySelector("canvas.web3d");
  console.log(canvas)
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(sizes.width, sizes.height)
  renderer.setClearColor(0xeeeeee, 1.0);
  // 添加相机
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 15;
  //添加人物模型到场景中
  loader.load(mesh, (fbx) => {
    // 创建平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 第一个参数是光的颜色，第二个参数是光的强度
    // 设置光源的位置
    directionalLight.position.set(1, 1, 1).normalize();
    // 将平行光源添加到场景中
    scene.add(directionalLight);
    fbx.position.set(0,-8,0)
    fbx.scale.set(0.01, 0.01, 0.01)
    //鼠标操作旋转、缩放
    new OrbitControls(camera, renderer.domElement);
    scene.add(fbx)
    function animate (fbx){
      requestAnimationFrame(animate);
      if (fbx) {
        // fbx.rotation.x += 0.01;
        // fbx.rotation.y += 0.01;
        renderer.render(scene,camera)

      }
    }
    animate()
  });
 
 
})


</script>
<style>

</style>
