## 3D com Three.js

Esse código é um exemplo de uma aplicação usando a biblioteca Three.js, que é uma biblioteca em JavaScript para criação de gráficos 3D no navegador. A lib permite criar cenas 3D interativa com objetos, texturas, luzes, animações e controles de interface gráfica.

#### Como funciona a biblioteca (partes utilizadas no meu código): 
1. Importação de Bibliotecas:
~~~javascript 
import * as THREE from 'three';  // Importa a biblioteca Three.js.
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';  // Importa o controle de órbita para facilitar a interação com a cena.
import * as dat from 'dat.gui';  // Importa a biblioteca dat.GUI para criar uma interface gráfica de usuário interativa.
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';  // Importa o carregador de modelos 3D no formato GLTF (importados do Blender).
~~~
---
2. Criação do Renderer: 
~~~javascript
const renderer = new THREE.WebGLRenderer();  // Cria um renderizador WebGL.
renderer.shadowMap.enabled = true;  // Ativa o mapeamento de sombras.
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
~~~
---
3. Criação da Cena e Câmera: 
~~~javascript
const scene = new THREE.Scene();  // Cria uma cena Three.js.
const camera = new THREE.PerspectiveCamera(...);  // Cria uma perspectiva de câmera.
const orbit = new OrbitControls(camera, renderer.domElement);  // Cria controles de órbita para facilitar a navegação na cena.
~~~
---
4. Adição de Objetos à Cena:
- Vários objetos podem ser adicionados à cena, como cubos, esferas, planos, luzes, etc;
~~~javascript
// Exemplo: Cria um cubo e a adiciona à cena.
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
~~~
---
5. Carregamento de Texturas e Imagens:
~~~javascript
const textureLoader = new THREE.TextureLoader();  // Cria um carregador de texturas.
scene.background = cubeTextureLoader.load([...]);  // Define um fundo de cena com texturas carregadas.
~~~
---
6. Carregamento de Modelos 3D (importado do Blender): 
~~~javascript
const assetLoader = new GLTFLoader();  // Cria um carregador para modelos GLTF.
assetLoader.load(monkeyUrl.href, function(gltf) { ... });  // Carrega um modelo 3D (nesse caso, um arquivo GLTF de um macaco).
~~~
---
7. Controles de Interface Gráfica (dat.GUI):
~~~javascript
const gui = new dat.GUI();  // Cria uma interface gráfica interativa.
gui.addColor(options, 'sphereColor').onChange(function(e){ ... });  // Adiciona uma opção para alterar a cor de uma esfera na cena.
~~~
---
8. Animações: 
~~~javascript
renderer.setAnimationLoop(animate);  // Configura um loop de animação usando a função animate.
function animate(time) { ... }  // Função de animação que atualiza a cena e renderiza os quadros.
~~~
---
9. Detecção de Interação do Mouse: 
~~~javascript
window.addEventListener('mousemove', function(e) { ... });  // Atualiza a posição do mouse para interação.
rayCaster.setFromCamera(mousePosition, camera);  // Lança um raio do mouse para a cena e verifica se atinge objetos.
~~~
---
10. Resposta a Eventos de Redimensionamento da Janela (responsividade): 
~~~javascript
window.addEventListener('resize', function() { ... });  // Atualiza a câmera e o renderizador quando a janela é redimensionada.
~~~
---
#### Resultado: 
![image](https://github.com/htamagnus/three.js-introduction/assets/85269068/7a624feb-0e87-48e1-9de3-1121b4a28ddd)
