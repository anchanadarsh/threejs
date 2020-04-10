let scene;
let camera;
let renderer;
let texture;
let videoElement;

init();
animate();

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.vr.enabled = true;

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );;
  camera.position.z = 500;
  camera.target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(camera.target);

  const container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  videoElement = document.createElement('video');
  videoElement.src = '../common/360-video.mp4';
  videoElement.load();
  videoElement.crossOrigin = 'anonymous';
  videoElement.setAttribute('webkit-playsinline', 'true');
  videoElement.setAttribute('playsinline', 'true');

  const geometry = new THREE.SphereGeometry(400, 60, 40);
  texture = new THREE.Texture(videoElement);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.x = -1;

  // WebVR
  if (WEBVR.checkAvailability()) {
    WEBVR.getVRDisplay(function(display) {
      renderer.vr.setDevice(display);
      document.body.appendChild(WEBVR.getButton(display, renderer.domElement));
			document.getElementById('enter-vr').addEventListener('click', toggleVideo);
    });
  }

  function toggleVideo() {
    if ( videoElement.paused ) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }

  document.getElementById('no-vr').addEventListener('click', toggleVideo);

  scene.add(mesh);
  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );

  if( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ){
    texture.needsUpdate = true;
  }
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
