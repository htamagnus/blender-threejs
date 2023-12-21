// Importa bibliotecas necessárias
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Importa imagens/texturas
import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";

// Obtém o caminho do modelo GLTF usando o objeto import.meta.url
const monkeyUrl = new URL("../assets/monkey.glb", import.meta.url);

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

// Cria um eixo de referência visual
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Define a posição inicial da câmera e atualiza os controles
camera.position.set(-10, 30, 30);
orbit.update();

// Cria um cubo e a adiciona à cena
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// Cria um plano e o adiciona à cena
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// Cria um auxiliar de grid e o adiciona à cena
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

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

// Carrega texturas para criar um cubemap e define como fundo da cena
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
// Passa um array com uma imagem para cada lado do cubo
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars,
]);

// Cria um segundo cubo com material múltiplo e a adiciona à cena
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  //color: 0x00FF00,
  //map: textureLoader.load(nebula)
});
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);

// Cria um plano com wireframe e o adiciona à cena
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

// Modifica aleatoriamente alguns pontos do plano
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

// Cria uma esfera com material shader e a adiciona à cena
const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

// Carrega um modelo GLTF de um macaco e adiciona à cena
const assetLoader = new GLTFLoader();
let mixer;
assetLoader.load(
  monkeyUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);

    // Cria um mixer para animações e obtém as animações do modelo
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Reproduz uma animação específica
    const clip = THREE.AnimationClip.findByName(clips, "myAnimation");
    const action = mixer.clipAction(clip);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Cria uma interface gráfica interativa usando dat.GUI
const gui = new dat.GUI();

// Opções de controle para a interface gráfica
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};

// Adiciona opções de controle à interface gráfica
gui.addColor(options, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function (e) {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);

gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

// Registra a posição do mouse para interação
const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Configura um Raycaster para detecção de interação do mouse
const rayCaster = new THREE.Raycaster();

// Identificador da esfera para detecção de colisão
const sphereId = sphere.id;
box2.name = "theBox"; // Define um nome para a caixa

// Cria um relógio para animações
const clock = new THREE.Clock();

// Função de animação principal
function animate(time) {
  // Atualiza o mixer em cada quadro se existir
  if (mixer) mixer.update(clock.getDelta());

  // Rotaciona a caixa
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  // Move a esfera para cima e para baixo
  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  // Atualiza parâmetros da luz de ponto
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;

  // Atualiza o auxiliar visual da luz de ponto
  sLightHelper.update();

  // Lança um raio do mouse na cena e verifica colisões
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);

  // Responde às colisões
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereId)
      intersects[i].object.material.color.set(0xff0000);

    if (intersects[i].object.name === "theBox") {
      intersects[i].object.rotation.x = time / 1000;
      intersects[i].object.rotation.y = time / 1000;
    }
  }

  // Modifica aleatoriamente alguns pontos do plano
  plane2.geometry.attributes.position.array[0] = 10 * Math.random();
  plane2.geometry.attributes.position.array[1] = 10 * Math.random();
  plane2.geometry.attributes.position.array[2] = 10 * Math.random();
  plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true;

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
