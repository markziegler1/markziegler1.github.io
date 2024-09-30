// Scene
const scene = new THREE.Scene();

// Sphere Geometry (for the planet)
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: "#b3c9bf" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Lighting Enhancements
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create a point light to simulate the sun
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 20); // Keep the camera position as it is
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enable shadows for the sphere
mesh.castShadow = true;
mesh.receiveShadow = true;

// Orbit Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2; // Adjusted for better visibility
controls.enableZoom = false;

// Load textures for stars
const loader = new THREE.TextureLoader();
const starTextures = [
  loader.load("img/star.png"),
  loader.load("img/star2.png"),
  loader.load("img/star3.png"),
];

// Generate star positions in a spherical distribution
const starCount = 500; // Increased number of stars
const stars = new THREE.Group();

for (let i = 0; i < starCount; i++) {
  const theta = Math.random() * Math.PI * 2; // Random angle around the Y axis
  const phi = Math.acos(2 * Math.random() - 1); // Random angle from the Y axis

  const radius = 15; // Radius from the center of the sphere (increase this)

  // Convert spherical coordinates to Cartesian coordinates
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  // Randomly select a star texture
  const randomTexture =
    starTextures[Math.floor(Math.random() * starTextures.length)];

  // Create a star sprite
  const starMaterial = new THREE.SpriteMaterial({
    map: randomTexture,
    color: 0xffffff,
    transparent: true,
    opacity: 1,
  });

  const star = new THREE.Sprite(starMaterial);
  star.scale.set(0.3 + Math.random() * 0.3, 0.3 + Math.random() * 0.3, 1); // Varying star sizes
  star.position.set(x, y, z);
  stars.add(star);
}

scene.add(stars);

// Resize Event
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
const animate = () => {
  stars.rotation.x += 0.0005; // Add slight rotation to stars
  stars.rotation.y += 0.0005;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// GSAP Animations
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation Color
let mouseDown = false;
let rgb = [];

window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));
window.addEventListener("mousemove", (event) => {
  if (mouseDown) {
    rgb = [
      Math.round((event.pageX / sizes.width) * 255),
      Math.round((event.pageY / sizes.height) * 255),
      150,
    ];

    const newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
// Get the arrow button and the section to scroll to
const arrowDown = document.getElementById("scroll-down");
const nextSection = document.querySelector(".next-section");

// Scroll event handler
arrowDown.addEventListener("click", () => {
  nextSection.scrollIntoView({ behavior: "smooth" });
});
