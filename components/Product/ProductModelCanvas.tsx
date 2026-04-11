'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ProductModel } from '../../data/products';

type ProductModelCanvasProps = {
  model: ProductModel;
  interactive?: boolean;
  autoRotate?: boolean;
  className?: string;
};

function addBox(
  group: THREE.Group,
  material: THREE.Material,
  size: [number, number, number],
  position: [number, number, number],
  rotation: [number, number, number] = [0, 0, 0]
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(
  group: THREE.Group,
  material: THREE.Material,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  position: [number, number, number],
  rotation: [number, number, number] = [0, 0, 0],
  segments = 28
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function createTshirt(model: ProductModel) {
  const group = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({
    color: model.color,
    roughness: 0.78,
    metalness: 0.03,
  });
  const trim = new THREE.MeshStandardMaterial({
    color: model.accent ?? '#d8d2c4',
    roughness: 0.88,
    metalness: 0.02,
  });
  const shadow = new THREE.MeshStandardMaterial({
    color: '#0c0c0c',
    roughness: 0.9,
    metalness: 0,
  });

  addBox(group, fabric, [2.1, 2.25, 0.28], [0, -0.15, 0]);
  addBox(group, fabric, [0.68, 0.62, 0.26], [-1.32, 0.58, 0], [0, 0, -0.22]);
  addBox(group, fabric, [0.68, 0.62, 0.26], [1.32, 0.58, 0], [0, 0, 0.22]);
  addBox(group, fabric, [2.28, 0.14, 0.3], [0, -1.34, 0.02]);
  addCylinder(group, trim, 0.34, 0.34, 0.05, [0, 0.98, 0.19], [Math.PI / 2, 0, 0], 48);
  addCylinder(group, shadow, 0.25, 0.25, 0.052, [0, 0.98, 0.215], [Math.PI / 2, 0, 0], 48);
  addBox(group, trim, [0.22, 0.1, 0.035], [0.52, 0.34, 0.17]);

  return group;
}

function createHoodie(model: ProductModel) {
  const group = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({
    color: model.color,
    roughness: 0.86,
    metalness: 0.02,
  });
  const detail = new THREE.MeshStandardMaterial({
    color: model.accent ?? '#f2f2f2',
    roughness: 0.88,
    metalness: 0,
  });
  const pocket = new THREE.MeshStandardMaterial({
    color: new THREE.Color(model.color).multiplyScalar(0.78),
    roughness: 0.9,
    metalness: 0,
  });

  addBox(group, fabric, [2.1, 2.5, 0.44], [0, -0.2, 0]);
  addBox(group, fabric, [0.58, 1.85, 0.36], [-1.3, -0.18, 0], [0, 0, -0.08]);
  addBox(group, fabric, [0.58, 1.85, 0.36], [1.3, -0.18, 0], [0, 0, 0.08]);
  addCylinder(group, fabric, 0.54, 0.68, 0.55, [0, 1.08, -0.08], [Math.PI / 2, 0, 0], 48);
  addCylinder(group, detail, 0.38, 0.46, 0.58, [0, 1.08, 0], [Math.PI / 2, 0, 0], 48);
  addBox(group, pocket, [1.0, 0.48, 0.08], [0, -0.55, 0.27]);
  addCylinder(group, detail, 0.018, 0.018, 0.74, [-0.16, 0.64, 0.28], [0.18, 0, 0], 12);
  addCylinder(group, detail, 0.018, 0.018, 0.74, [0.16, 0.64, 0.28], [0.18, 0, 0], 12);
  addBox(group, detail, [0.14, 0.09, 0.035], [0.58, 0.44, 0.27]);

  return group;
}

function createPants(model: ProductModel) {
  const group = new THREE.Group();
  const fabric = new THREE.MeshStandardMaterial({
    color: model.color,
    roughness: 0.82,
    metalness: 0.03,
  });
  const detail = new THREE.MeshStandardMaterial({
    color: model.accent ?? '#222222',
    roughness: 0.9,
    metalness: 0.02,
  });

  addBox(group, fabric, [1.72, 0.36, 0.42], [0, 1.02, 0]);
  addCylinder(group, fabric, 0.36, 0.28, 2.35, [-0.44, -0.18, 0], [0, 0, -0.035], 28);
  addCylinder(group, fabric, 0.36, 0.28, 2.35, [0.44, -0.18, 0], [0, 0, 0.035], 28);
  addBox(group, detail, [0.08, 2.1, 0.035], [0, -0.16, 0.24]);
  addBox(group, detail, [0.52, 0.05, 0.035], [-0.44, 0.66, 0.24], [0, 0, -0.16]);
  addBox(group, detail, [0.52, 0.05, 0.035], [0.44, 0.66, 0.24], [0, 0, 0.16]);
  addBox(group, detail, [0.5, 0.08, 0.035], [-0.44, -1.43, 0.2]);
  addBox(group, detail, [0.5, 0.08, 0.035], [0.44, -1.43, 0.2]);

  return group;
}

function createProductModel(model: ProductModel) {
  if (model.kind === 'hoodie') {
    return createHoodie(model);
  }

  if (model.kind === 'pants') {
    return createPants(model);
  }

  return createTshirt(model);
}

export default function ProductModelCanvas({
  model,
  interactive = true,
  autoRotate = false,
  className = '',
}: ProductModelCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.35, 6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const product = createProductModel(model);
    product.rotation.y = -0.32;
    scene.add(product);

    const ambientLight = new THREE.HemisphereLight('#ffffff', '#16120d', 3.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#fff7e8', 4);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#cbb891', 2.6);
    rimLight.position.set(-4, 2.8, -3);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = interactive;
    controls.enabled = interactive;
    controls.minDistance = 4.2;
    controls.maxDistance = 8;
    controls.rotateSpeed = 0.9;
    controls.target.set(0, 0, 0);
    controls.update();

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let animationFrame = 0;

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);

      if (autoRotate && !interactive) {
        product.rotation.y += 0.006;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      product.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) {
          return;
        }

        child.geometry.dispose();

        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      });
      mount.removeChild(renderer.domElement);
    };
  }, [autoRotate, interactive, model]);

  return <div ref={mountRef} className={`h-full w-full ${className}`} />;
}
