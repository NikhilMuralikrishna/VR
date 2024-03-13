import React, { useEffect, useRef } from 'react';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LumaSplatsThree } from '@lumaai/luma-web';

const VRDemo = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderer = new WebGLRenderer({ antialias: false });
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const canvas = canvasRef.current;
    canvas.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const scene = new Scene();

    const splats = new LumaSplatsThree({
      source: 'https://lumalabs.ai/capture/c8d20536-ab07-43db-a6f5-06a0f739fc30',
    });
    scene.add(splats);

    function frameLoop() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }

      controls.update();
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(frameLoop);

    const vrButton = VRButton.createButton(renderer);
    canvas.appendChild(vrButton);

    return () => {
      splats.dispose();
      vrButton.remove();
    };
  }, []);

  return <div ref={canvasRef}></div>;
};

export default VRDemo;
