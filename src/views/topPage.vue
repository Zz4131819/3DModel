<template>
  <div class="box">
    <div class="upload-container">
      <div class="title-container">
        <h1 style="font-size: 50px;font-weight: 600;">Web全景</h1>
        <p style="font-size: 20px;font-style:oblique;">
          Web全景是基于Three.js实现的3D全景渲染，在下方可上传全景图片替换右边场景
        </p>
      </div>
      <div class="upload-assembly">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :limit="1"
          :on-change="fileProgress"
          :before-remove="fileRemove"
          :on-preview="filePreview"
          :accept="'image/*'"
        >
          <el-icon><div class="uploadIcon">+</div></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" style="width: 100%;height: 100%;" alt="Preview Image" />
        </el-dialog>
      </div>
    </div>
    <div class="canvas-container">
      <canvas id="topCanvas" style="width: 400px;height: 400px;"></canvas>
    </div>
  </div>

</template>
<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, reactive, ref } from 'vue';
import { getImgesList } from '../api/index'
import { ElLoading } from 'element-plus';

const dialogImageUrl = ref()
const dialogVisible = ref(false)
const scene = new THREE.Scene()
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
const fileProgress = (rawFile) =>{
  const url = URL.createObjectURL(rawFile.raw)
  sphericalGeometry(url)
  const visibility = document.querySelector(".el-upload--picture-card");
  visibility.style.display = "none"
  dialogImageUrl.value = url
} 
const fileRemove = () =>{
  const visibility = document.querySelector(".el-upload--picture-card");
  visibility.style.display = "flex"
  dialogImageUrl.value = null
}
const filePreview = () =>{
  dialogVisible.value = true
}
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
const data = reactive({
  imges:[]
})
const getImgesListData = async () => {
  const res = await getImgesList();
  if (res.status === 200) {
      data.imges = await Promise.all(
          res.data.map(async (item) => {
              const url = 'http://127.0.0.1:8080/file/' + item;
              return { url: url };
          })
      );
      sphericalGeometry(data.imges[0].url)
  }
};
const canvas = ref()
const renderer = ref()
const camera = ref()
onMounted(()=>{
  canvas.value = document.getElementById("topCanvas");
  renderer.value = new THREE.WebGLRenderer({ canvas: canvas.value ,preserveDrawingBuffer:true});
  renderer.value.setSize(500, 400)
  renderer.value.setClearColor(0xffffff,0);
  camera.value = new THREE.PerspectiveCamera(75, 500 / 400);
  camera.value.position.set(10,10,10); // 设置相机位置
  camera.value.lookAt(new THREE.Vector3(1, 1, 1));
  getImgesListData()
})
</script>
<style lang="scss" scoped>
  .box{
    width: 100%;
    height:100%;
    display: flex;
    background-image: url('../assets/images/pexels2.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    .upload-container{
      width: 45%;
      padding: 20px;
      .title-container{
        width: 100%;
        height: 40%;
      }
      .upload-assembly{
        display: flex;
        width: 100%;
        height: 60%;
        justify-content: center;
        .uploadIcon{
          font-size: 48px;
          font-style: normal;
          font-weight: 500;
        }
      }
    }
    .canvas-container {
      overflow: hidden;
      padding: 8%;
      width: 55%;
      height: 350px;
    }
  }
</style>
 