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

  /* -------------------------
     RÉDUCTION DU COÛT CPU/GPU
     ------------------------- */
  scene = new Scene()
  camera = new PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.set(0, 0, 4)

  renderer = new WebGLRenderer({
    antialias: false,       // plus léger
    alpha: true
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6)) // limite CPU mobile
  renderer.setSize(w, h)
  renderer.outputColorSpace = 'srgb-linear'
  wrap.value.appendChild(renderer.domElement)

  /* Lumière simplifiée mais très propre visuellement */
  scene.add(new AmbientLight(0xffffff, 0.8))
  const dir = new DirectionalLight(0x66ffcc, 0.5)
  dir.position.set(3, 4, 2)
  scene.add(dir)

  /* -------------------------
     GLOBE 40% PLUS LÉGER
     ------------------------- */
  group = new Group()
  scene.add(group)

  const globeGeom = new SphereGeometry(1.25, 40, 40) // ← 64→40 segments = énorme gain
  const globeMat = new MeshStandardMaterial({
    color: new Color('#0F141A'),
    roughness: 0.55,
    metalness: 0.18,
    emissive: new Color('#082016'),
    emissiveIntensity: 0.28
  })
  globe = new Mesh(globeGeom, globeMat)
  group.add(globe)

  /* Wireframe optimisé */
  const wireGeom = new WireframeGeometry(new SphereGeometry(1.26, 20, 14)) // ← 24/16 → 20/14
  const wireMat = new LineBasicMaterial({
    color: '#00EE8A',
    transparent: true,
    opacity: 0.22
  })
  wire = new LineSegments(wireGeom, wireMat)
  group.add(wire)

  /* -------------------------
     ORBITAL POINTS LÉGERS
     ------------------------- */
  const orbGeom = new SphereGeometry(0.055, 12, 12)
  const orbMat = new MeshStandardMaterial({
    color: '#00D5FF',
    emissive: '#00D5FF',
    emissiveIntensity: 0.6
  })

  const radii = [1.45, 1.6, 1.75]
  const speeds = [0.7, -0.55, 0.38]

  for (let i = 0; i < 3; i++) {
    const o = new Mesh(orbGeom, orbMat)
    o.userData = { r: radii[i], a: Math.random() * Math.PI * 2, s: speeds[i] } as OrbUD
    orbs.push(o)
    group.add(o)
  }

  /* Resize */
  window.addEventListener('resize', onResize, { passive: true })

  /* Lancement immédiat */
  animate()
}

/* -------------------------
   RESIZE ULTRA RAPIDE
   ------------------------- */
function onResize() {
  if (!wrap.value) return
  const w = wrap.value.clientWidth
  const h = wrap.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

/* -------------------------
   ANIMATION OPTIMISÉE
   ------------------------- */
function animate() {
  raf = requestAnimationFrame(animate)

  // accélération légère du globe = impression d'apparition instantanée
  group.rotation.y += 0.005
  wire.rotation.y -= 0.0015

  const t = performance.now() * 0.001

  for (let i = 0; i < orbs.length; i++) {
    const o = orbs[i]
    const ud = o.userData as OrbUD
    const ang = ud.a + t * ud.s
    const incl = (i - 1) * 0.3

    o.position.set(
      Math.cos(ang) * ud.r,
      Math.sin(ang * 1.1) * 0.32 + Math.sin(incl) * 0.18,
      Math.sin(ang) * (ud.r * 0.55)
    )
  }

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
.hero-vis {
  width: 100%;
  height: 100%;
  display: block;
  transform: translateZ(0); /* accélère le rendu mobile */
}
</style>
