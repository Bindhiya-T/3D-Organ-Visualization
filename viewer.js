import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('.viewer-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

const fileInput = document.getElementById('fileInput');
const generateBtn = document.getElementById('generateBtn');

let defaultMesh = null;

// Function to determine model color and information based on file name
function getModelData(fileName) {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes("vertebrae")) return { color: 0xD3D3D3, info: "The vertebrae form the backbone, providing structural support and protecting the spinal cord." };
    if (lowerName.includes("clavicle")) return { color: 0xD3D3D3, info: "The clavicle is an elongated, S-shaped bone that rests horizontally at the sternum across the upper part of the ribcage, and the acromial end of the scapula. This bone is an important part of the skeletal system since it plays an essential role in everyday functional movement, serving as the connection between the axial skeleton and the pectoral girdle." };
    if (lowerName.includes("rib")) return { color: 0xD3D3D3, info: "Your rib cage surrounds and protects the vital organs in your chest cavity, your heart and lungs. It expands with your lungs when you breathe. As part of your axial skeleton, your rib cage helps form the trunk of your body. It also serves as an attachment point for core muscles, like your diaphragm." };
    if (lowerName.includes("heart")) return { color: 0xff0000, info: "The heart is a vital organ that pumps blood throughout the body. The main function of the heart is to deliver oxygen-rich blood to every cell in the body. The arteries are the passageways through which the blood is delivered and the veins are the passageways through which the blood is collected and returned to the heart." };
    if (lowerName.includes("lung")) return { color: 0xADD8E6, info: "The lungs are responsible for oxygen exchange in the bloodstream.They are the major organs of the respiratory system, which helps provide the body with a continuous supply of oxygen. The lungs take more than 6 million breaths per year and affect every aspect of our bodies and health." };
    if (lowerName.includes("liver")) return { color: 0x8B0000, info: "The liver is the largest solid organ in the body that performs over 500 vital functions, filters all of the blood in the body and breaks down poisonous substances, such as alcohol and drugs." };
    if (lowerName.includes("kidney")) return { color: 0x8B0000, info: "The kidneys filter waste from the blood and regulate fluid balance." };
    if (lowerName.includes("brain")) return { color: 0xFFDAB9, info: "The brain controls body functions and processes sensory information. It controls nearly every aspect of the human body and is composed of neurons, grey matter and white matter." };
    if (lowerName.includes("face")) return { color: 0xFFCC99, info: "The human face includes the eyes, nose, mouth, and forehead, playing a crucial role in communication and identity." };

    return { color: 0x0077ff, info: "Unknown organ or structure." };
}

// Function to display information pop-up
function showInfoPopup(infoText) {
    let infoPopup = document.getElementById('info-popup');
    if (!infoPopup) {
        infoPopup = document.createElement('div');
        infoPopup.id = 'info-popup';
        infoPopup.style.position = 'absolute';
        infoPopup.style.top = '80px';
        infoPopup.style.right = '20px';
        infoPopup.style.padding = '15px';
        infoPopup.style.background = 'rgba(255, 255, 255, 0.9)';
        infoPopup.style.border = '1px solid #ccc';
        infoPopup.style.borderRadius = '8px';
        infoPopup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        infoPopup.style.maxWidth = '250px';
        document.body.appendChild(infoPopup);
    }
    infoPopup.innerHTML = `<strong>Organ Info:</strong><br>${infoText}`;
}

// Function to load STL model
function loadSTLModel(contents, fileName) {
    const loader = new STLLoader();
    const geometry = loader.parse(contents);
    
    if (defaultMesh) {
        scene.remove(defaultMesh);
    }
    
    const modelData = getModelData(fileName);
    const material = new THREE.MeshStandardMaterial({ color: modelData.color, metalness: 0.5, roughness: 0.1 });
    const mesh = new THREE.Mesh(geometry, material);

    // Center the model
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    mesh.position.set(-center.x, -center.y, -center.z);

    scene.add(mesh);
    defaultMesh = mesh;

    showInfoPopup(modelData.info);
}

// Event listener for generate button
generateBtn.addEventListener('click', function () {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            loadSTLModel(contents, file.name);
        };
        reader.readAsArrayBuffer(file);
    }
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
