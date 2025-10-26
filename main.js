const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let stars, starGeo, starMaterial;
let textCube;
let lastColorChange = 0;

setupLighting();
createTextCube();
createRain();

function createRain() {
  const points = [];
  for (let i = 0; i < 6000; i++) {
    const star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }
  starGeo = new THREE.BufferGeometry().setFromPoints(points);
  const sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
    transparent: true
  });
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateRain() {
  const positions = starGeo.attributes.position.array;
  for (let i = 1; i < positions.length; i += 3) {
    positions[i] -= 1.0;
    if (positions[i] < -200) positions[i] = 200;
  }
  starGeo.attributes.position.needsUpdate = true;
}

function setupLighting() {
  const hemiLight = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(hemiLight);
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function createTextCube() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 512;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "bold 100px Arial";
  context.fillStyle = "cyan";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("PAJO", canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const cubeGeometry = new THREE.BoxGeometry(10, 5, 5, 5);
  textCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  textCube.position.z = -5;
  camera.position.z = 20;
  scene.add(textCube);
}

function animate(time) {
  requestAnimationFrame(animate);
  animateRain();

  if (textCube) {
    textCube.rotation.x += 0.01;
    textCube.rotation.y += 0.01;
  }

  if (time - lastColorChange > 3000) {
    starMaterial.color.setHSL(Math.random(), 1.0, 0.5);
    lastColorChange = time;
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});