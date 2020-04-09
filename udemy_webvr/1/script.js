let scene;
let camera;
let renderer;

init();
animate();

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.vr.enabled = true;

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;
  camera.target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(camera.target);

  const container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(400, 60, 40);
  const texture = new THREE.TextureLoader().load('../common/pano.jpg');
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  const mesh = new THREE.Mesh(geometry, material);

  // WebVR
  if (WEBVR.checkAvailability()) {
    WEBVR.getVRDisplay(function(display) {
      renderer.vr.setDevice(display);
      document.body.appendChild(WEBVR.getButton(display, renderer.domElement));
    });
  }

  scene.add(mesh);

  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
