// Importa bibliotecas necessárias
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Importa imagens/texturas
import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";

// Obtém o caminho do modelo GLTF usando o objeto import.meta.url
const houseUrl = new URL("../assets/house.glb", import.meta.url);

// Cria um renderizador WebGL
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; // Ativa mapeamento de sombras
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cria uma cena Three.js
const scene = new THREE.Scene();

// Cria uma câmera de perspectiva
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Adiciona controles de órbita para facilitar a navegação
const orbit = new OrbitControls(camera, renderer.domElement);

// Define a posição inicial da câmera e atualiza os controles
camera.position.set(-10, 30, 30);
orbit.update();

// Cria uma esfera e a adiciona à cena
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// Cria uma luz ambiente e a adiciona à cena
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Cria uma luz de ponto (spotlight) e a adiciona à cena
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

// Cria um auxiliar visual para a luz de ponto
const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// Define uma névoa para a cena
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// Carrega um modelo GLTF de uma casa e adiciona à cena
const assetLoader = new GLTFLoader();
let mixer;
assetLoader.load(
  houseUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);

    // Adicione uma luz direcional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 0); // Posição da luz
    scene.add(directionalLight);

    // Habilitar sombras para a luz direcional
    directionalLight.castShadow = true;

    // Configurações opcionais para sombras mais suaves
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;

    // Permitir que os objetos recebam sombras
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Configurar o material para sombras mais suaves
        child.material.shadowSide = THREE.FrontSide;
        child.material.shadowBias = -0.002;
      }
    });
  },
  function (error) {
    console.error(error);
  }
);


let step = 0;

// Registra a posição do mouse para interação
const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Configura um Raycaster para detecção de interação do mouse
const rayCaster = new THREE.Raycaster();

// Função de animação principal
function animate(time) {
  // Atualiza o mixer em cada quadro se existir
  if (mixer) mixer.update(clock.getDelta());

  // Move a esfera para cima e para baixo
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  // Atualiza o auxiliar visual da luz de ponto
  sLightHelper.update();

  // Lança um raio do mouse na cena e verifica colisões
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  // Renderiza a cena
  renderer.render(scene, camera);
}

// Configura um loop de animação usando a função animate
renderer.setAnimationLoop(animate);

// Atualiza a câmera e o renderizador quando a janela é redimensionada
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
