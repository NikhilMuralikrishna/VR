import React, { useEffect, useRef } from 'react'; // Importing necessary React hooks
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'; // Importing VRButton from three.js
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'; // Importing necessary three.js components
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Importing OrbitControls from three.js
import { LumaSplatsThree } from '@lumaai/luma-web'; // Importing LumaSplatsThree from luma-web library

function VRDemo() {
    const containerRef = useRef(); // Creating a reference to hold the container DOM element

    useEffect(() => {
        const container = containerRef.current; // Accessing the container DOM element using the ref
        const renderer = new WebGLRenderer({ antialias: true }); // Creating a WebGLRenderer instance
        renderer.xr.enabled = true; // Enabling WebXR support for VR

        // Setting styles for the renderer's DOM element
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        container.appendChild(renderer.domElement); // Appending renderer's DOM element to the container

        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Creating a PerspectiveCamera
        camera.position.z = 2; // Setting camera position

        const controls = new OrbitControls(camera, renderer.domElement); // Creating OrbitControls
        controls.enableDamping = true; // Enabling damping for smoother controls

        const scene = new Scene(); // Creating a new Scene

        // Creating a LumaSplatsThree instance and adding it to the scene
        const splat = new LumaSplatsThree({
            source: 'https://lumalabs.ai/capture/c8d20536-ab07-43db-a6f5-06a0f739fc30'
        });
        scene.add(splat);

        // Function to render the scene on each frame
        function frameLoop() {
            const canvas = renderer.domElement; // Accessing the canvas
            const width = canvas.clientWidth; // Getting the client width of the canvas
            const height = canvas.clientHeight; // Getting the client height of the canvas

            // Adjusting camera aspect ratio and renderer size if canvas dimensions change
            if (canvas.width !== width || canvas.height !== height) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }

            controls.update(); // Updating OrbitControls

            renderer.render(scene, camera); // Rendering the scene
        }

        renderer.setAnimationLoop(frameLoop); // Setting the animation loop

        const vrButton = VRButton.createButton(renderer); // Creating a VRButton for VR mode
        container.appendChild(vrButton); // Appending VRButton to the container

        // Cleanup function to remove event listeners and clean up resources
        return () => {
            renderer.setAnimationLoop(null); // Stopping the animation loop
            container.removeChild(renderer.domElement); // Removing renderer's DOM element from the container
            container.removeChild(vrButton); // Removing VRButton from the container
        };
    }, []); // Empty dependency array ensures useEffect runs only once after initial render

    // Returning a div with a ref to hold the renderer's DOM element
    return <div ref={containerRef} />;
}

export default VRDemo; // Exporting the VRDemo component
