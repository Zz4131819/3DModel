<template>
     <video
      preload
      ref="video"
      controls
      loop
      style="width: 100%; visibility: hidden; position: absolute"
      :src="src"
    ></video>
    <canvas id="videoT" style="width: 100%;height: 100%;"></canvas>
</template>
<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from "vue";
import vShader from "../components/top.glsl";
import fShader from "../components/f.glsl";

const src = new URL(`../assets/RedVR.mp4`, import.meta.url).href
const videoTexture = ref(null);
const initVideoTexture = () => {
    return Promise.resolve(document.querySelector("video")).then((video) => {
        videoTexture.value = new THREE.VideoTexture(video);
        videoTexture.value.needsUpdate = true;
        videoTexture.value.updateMatrix();
        video.crossOrigin = 'anonymous';
        video.setAttribute('webkit-playsinline', 'true');
        video.loop = true;
        video.muted = true;

        // Play video when it's ready
        video.addEventListener('canplaythrough', function() {
            video.play();
        });
    });
}
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

//场景
const scene = new THREE.Scene()
onMounted(()=>{
    //获取画布元素
    Promise.resolve(document.getElementById("videoT")).then((canvas) => {
        if (canvas) {
            const renderer = new THREE.WebGLRenderer({ canvas: canvas });
            renderer.setSize(sizes.width, sizes.height)
            renderer.setClearColor(0xffffff,0);
            // 添加相机
            const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
            camera.position.set(0,0,10); // 设置相机位置
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            new OrbitControls(camera, renderer.domElement);
            initVideoTexture().then(()=>{
                // 创建全景球体
                const geometry = new THREE.SphereGeometry(500, 60, 40);
                videoTexture.value.minFilter = THREE.LinearFilter;
                videoTexture.value.format = THREE.RGBFormat;
                // const material = new THREE.MeshBasicMaterial({ map: videoTexture.value, side: THREE.DoubleSide });
                const material = new THREE.ShaderMaterial({
                    wireframe: false,
                    side: THREE.DoubleSide,
                    map: videoTexture.value,
                    uniforms: {
                    tex_0: new THREE.Uniform(videoTexture.value),
                    },
                    vertexShader: vShader,
                    fragmentShader: fShader,
                });
                const sphere = new THREE.Mesh(geometry, material);
                scene.add(sphere);
                console.log(videoTexture.value)
                // 渲染函数
                const  render = () => {
                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                }
                render();
            })
        } else {
            console.log('error')
        }
    });
   
    
})

</script>

