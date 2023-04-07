import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import vertexShader from './shaders/waterWithFog/vertexShader.glsl'
import fragmentShader from './shaders/waterWithFog/fragmentShader.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50);

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(15, 15, 512, 512)

// Material
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uTime: {value: 0},

        uBigWavesElevation: {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(3.0, 2.0)},
        uBigWavesSpeed: {value: 0.75},

        uSmallWavesElevation: {value: 0.15},
        uSmallWavesFrequency: {value: 3},
        uSmallWavesSpeed: {value: 0.2},
        uSmallWavesIterations: {value: 4.0},
        
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 5}
    }
})

// Debug
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.01).name("uBigWavesSpeed")
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name("uBigWavesElevation")
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(20).step(0.01).name("uBigWavesFrequencyZ")
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(20).step(0.01).name("uBigWavesFrequencyX")

gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(5).step(0.01).name("uSmallWavesSpeed")
gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.01).name("uSmallWavesElevation")
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(20).step(0.01).name("uSmallWavesFrequency")
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(5).step(1).name("uSmallWavesIterations")


gui.addColor(waterMaterial.uniforms.uDepthColor, 'value').name("uDepthColor")/* .onChange((color) => {debugObject.depthColor = color}) */
gui.addColor(waterMaterial.uniforms.uSurfaceColor, 'value').name("uSurfaceColor")/* .onChange((color) => {debugObject.surfaceColor = color}) */
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(2).step(0.01).name("uColorOffset")
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(8).step(0.01).name("uColorMultiplier")


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('grey', 1)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()