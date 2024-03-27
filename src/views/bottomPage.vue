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
            class="upload-demo"
            drag
            action="#"
            :on-exceed="onExceed"
            :on-change="fileProgress"
            :auto-upload="false"
            :accept="'.obj,.fbx,.glb,.gltf'"
            v-model:file-list="fileList"
            :limit="1"
          >
          <el-icon class="el-icon--upload"><img src="../assets/images/uplaod.png" style="width: 5rem;" /></el-icon>
          <div class="el-upload__text">
            拖拽文件到此，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              仅支持.obj,.fbx,.glb,.gltf格式的模型文件
            </div>
          </template>
          </el-upload>
        </div>
      </div>
      <div class="canvas-container">
        <canvas id="bottomCanvas" style="width: 400px;height: 400px;"></canvas>
      </div>
    </div>
  
  </template>
  <script setup>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { onMounted, ref } from 'vue';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
  import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
  const scene = new THREE.Scene()

  const gltfLoader = new GLTFLoader()
  const fbxLoader = new FBXLoader()
  const objLoader = new OBJLoader()

  const fileList = ref([])
  const onExceed = (files) =>{
    fileList.value = files
    const suffix = files[0].name
    const url = URL.createObjectURL(files[0]);
    judgment(suffix,url)
  }
  const fileProgress = (rawFile) =>{
    const suffix = rawFile.name.split('.').pop();
    const url = URL.createObjectURL(rawFile.raw);
    judgment(suffix,url)
  } 
  const judgment = (suffix,url) =>{
    scene.traverse(child => {
      // console.log(child instanceof THREE.Mesh)
      if (child instanceof THREE.Mesh) {
        console.log('Mesh',child instanceof THREE.Mesh)
        scene.remove(child)
      }
      scene.remove(child)
    });
    if (suffix == 'obj') {
        objLoading(url)
    } else if(suffix == 'glb' || suffix == 'gltf') {
        gltfLoading(url)
    } else if (suffix == 'fbx'){
        fbxLoading(url)
    }   
  }

  const gltfLoading = (mesh) => {
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
        animateFunction(mixer)
    });
  }
  const fbxLoading = (mesh) => {
    fbxLoader.load(mesh,(fbx) => {
        const model = fbx.scene;
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
        animateFunction(mixer)
    })
  }
  const objLoading = (mesh) => {
    console.log(mesh)
    let blobURL = URL.createObjectURL(mesh);
    objLoader.load(blobURL,(obj) => {
        console.log(obj)
        const model = obj.scene;
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
        animateFunction(mixer)
    })
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
  const canvas = ref()
  const renderer = ref()
  const camera = ref()
  onMounted(()=>{
    canvas.value = document.getElementById("bottomCanvas");
    renderer.value = new THREE.WebGLRenderer({ canvas: canvas.value ,preserveDrawingBuffer:true});
    renderer.value.setSize(500, 400)
    renderer.value.setClearColor(0xffffff,0);
    camera.value = new THREE.PerspectiveCamera(75, 500 / 400);
    camera.value.position.set(10,10,10); // 设置相机位置
    camera.value.lookAt(new THREE.Vector3(1, 1, 1));
  })
  </script>
  <style lang="scss" scoped>
    .box{
      width: 100%;
      height:100%;
      display: flex;
      background-image: url('../assets/images/pexels.jpeg');
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
   