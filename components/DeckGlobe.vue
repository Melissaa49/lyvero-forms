<template>
  <div ref="wrap" class="hero-vis" aria-label="Globe 3D Lyvero" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import {
  Scene, PerspectiveCamera, WebGLRenderer,
  AmbientLight, DirectionalLight, Group,
  SphereGeometry, MeshStandardMaterial, Color,
  Mesh, WireframeGeometry, LineBasicMaterial, LineSegments
} from 'three'

type OrbUD = { r: number; a: number; s: number }

const wrap = ref<HTMLDivElement | null>(null)
let scene: Scene
let camera: PerspectiveCamera
let renderer: WebGLRenderer
let group: Group
let globe: Mesh
let wire: LineSegments
const orbs: Mesh[] = []
let raf = 0

function init() {
  if (!wrap.value) return
  const w = wrap.value.clientWidth
  const h = wrap.value.clientHeight

  scene = new Scene()
  camera = new PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.set(0, 0, 4.2)

  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)
  wrap.value.appendChild(renderer.domElement)

  scene.add(new AmbientLight(0xffffff, 0.85))
  const dir = new DirectionalLight(0x66ffcc, 0.65)
  dir.position.set(3, 4, 2)
  scene.add(dir)

  group = new Group()
  scene.add(group)

  const globeGeom = new SphereGeometry(1.25, 64, 64)
  const globeMat = new MeshStandardMaterial({
    color: new Color('#0F141A'),
    roughness: 0.6,
    metalness: 0.2,
    emissive: new Color('#082016'),
    emissiveIntensity: 0.35
  })
  globe = new Mesh(globeGeom, globeMat)
  group.add(globe)

  const wireGeom = new WireframeGeometry(new SphereGeometry(1.26, 24, 16))
  const wireMat = new LineBasicMaterial({ color: '#00EE8A', transparent: true, opacity: 0.28 })
  wire = new LineSegments(wireGeom, wireMat)
  group.add(wire)

  const orbGeom = new SphereGeometry(0.06, 20, 20)
  const orbMat = new MeshStandardMaterial({ color: '#00D5FF', emissive: '#00D5FF', emissiveIntensity: 0.7 })
  const radii = [1.5, 1.7, 1.9]
  const speeds = [0.6, -0.45, 0.32]
  for (let i = 0; i < 3; i++) {
    const o = new Mesh(orbGeom, orbMat)
    o.userData = { r: radii[i], a: Math.random() * Math.PI * 2, s: speeds[i] } as OrbUD
    orbs.push(o)
    group.add(o)
  }

  window.addEventListener('resize', onResize, { passive: true })
  animate()
}

function onResize() {
  if (!wrap.value) return
  const w = wrap.value.clientWidth
  const h = wrap.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

function animate() {
  raf = requestAnimationFrame(animate)
  group.rotation.y += 0.0025
  wire.rotation.y -= 0.001

  const t = performance.now() * 0.001
  orbs.forEach((o, i) => {
    const { r, s, a } = o.userData as OrbUD
    const incl = (i - 1) * 0.35
    const ang = a + t * s
    o.position.set(Math.cos(ang) * r, Math.sin(ang * 1.15) * 0.35 + Math.sin(incl) * 0.2, Math.sin(ang) * r * 0.6)
  })
  renderer.render(scene, camera)
}

onMounted(init)
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<style scoped>
.hero-vis { width: 100%; height: 100%; display: block; }
</style>
