<template>
  <div class="beta-door-overlay" :class="{ 'beta-door-overlay--started': started }">

    <!-- Fond + matrix -->
    <div class="beta-door-bg">
      <div class="beta-door-matrix"></div>
    </div>

    <div class="beta-door-scene">

      <!-- Caméra + porte -->
      <div class="beta-door-camera" :class="{ 'camera-zoom': started }">
        <div class="beta-door-wrapper">
          <div class="door-frame">
            <div class="door" :class="{ 'door--anim': started }">
              <div class="door-panel">
                <div class="door-handle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ⭐ MESSAGE DERRIÈRE LA PORTE ⭐ -->
      <div class="door-message" :class="{ 'door-message--visible': started }">
        <h2>Vous faites désormais partie<br>des pionniers de Lyvero.</h2>
        <p>Merci de rejoindre l’aventure avant tout le monde.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const started = ref(false)

/**
 * Appelée par le parent après validation du formulaire :
 * door.value?.start()
 */
const start = () => {
  if (!started.value) started.value = true
}

defineExpose({ start })
</script>


<style scoped>
/* -------------------------
   OVERLAY
------------------------- */
.beta-door-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, #02121a 0, #01050a 40%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.beta-door-overlay--started {
  opacity: 1;
  pointer-events: auto;
}

/* -------------------------
   BACKGROUND + MATRIX
------------------------- */
.beta-door-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.beta-door-matrix {
  position: absolute;
  inset: -200px 0 0 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 255, 166, 0.2),
    rgba(0, 255, 166, 0.2) 2px,
    transparent 3px,
    transparent 7px
  );
  opacity: 0;
  filter: blur(0.8px);
  animation: matrixFade 1s ease forwards 1.3s,
             matrixMove 16s linear infinite 1.3s;
}

/* -------------------------
   SCENE
------------------------- */
.beta-door-scene {
  position: relative;
  width: min(420px, 100%);
  height: 100%;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* -------------------------
   CAMÉRA
------------------------- */
.beta-door-camera {
  width: 100%;
  display: flex;
  justify-content: center;
  perspective: 1200px;
  transition: transform 1.3s ease-out;
}

.camera-zoom {
  transform: scale(1.32);
}

/* -------------------------
   PORTE
------------------------- */
.beta-door-wrapper {
  position: relative;
  width: 220px;
  height: 360px;
}

.door-frame {
  position: absolute;
  inset: 0;
  margin: auto;
  padding: 10px;
  border-radius: 18px;
  background: radial-gradient(circle at top, #00ffa6 0, #02171c 35%, #000 100%);
  box-shadow:
    0 0 18px rgba(0, 255, 166, 0.4),
    0 0 55px rgba(0, 215, 194, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.door {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  transform-origin: left center;
  background: linear-gradient(180deg, #031d22 0%, #021a1f 35%, #020f14 65%, #03181f 100%);
  box-shadow:
    inset 0 0 0 1px rgba(0, 255, 166, 0.22),
    0 0 24px rgba(0, 255, 166, 0.25);
  position: relative;
  overflow: hidden;
}

.door-panel {
  position: absolute;
  inset: 10%;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 166, 0.18);
  box-shadow:
    inset 0 0 12px rgba(0, 255, 166, 0.15),
    0 0 8px rgba(0, 0, 0, 0.8);
}

.door-handle {
  position: absolute;
  right: 12%;
  top: 50%;
  width: 42px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, #00ffa6, #00d7c2);
  box-shadow:
    0 0 10px rgba(0, 255, 166, 0.8),
    0 0 22px rgba(0, 215, 194, 0.6);
  transform-origin: right center;
}

/* Animation poignée */
.door--anim .door-handle {
  animation: handleDown 0.35s ease-out forwards;
}

/* Animation ouverture porte */
.door--anim {
  animation: doorOpen 0.9s ease-out forwards 0.2s;
}

/* -------------------------
   MESSAGE DERRIÈRE LA PORTE
------------------------- */
.door-message {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center; /* centre vertical */
  align-items: center;     /* centre horizontal */
  text-align: center;
  padding: 0 20px;

  color: #cafff3;
  pointer-events: none;

  opacity: 0;
  transform: translateY(12px) scale(1.04);
  transition:
    opacity 1.1s ease 1.25s,
    transform 1.1s ease 1.25s;
}

.door-message--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.door-message h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #00ffc3;
  text-shadow: 0 0 12px rgba(0,255,200,0.4);
}

.door-message p {
  font-size: 12px;
  opacity: 0.85;
  max-width: 260px;
}

/* -------------------------
   ANIMATIONS
------------------------- */
@keyframes handleDown {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(25deg); }
}

@keyframes doorOpen {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(-90deg); }
}

@keyframes matrixFade {
  from { opacity: 0; }
  to   { opacity: 0.4; }
}

@keyframes matrixMove {
  from { transform: translateY(0); }
  to   { transform: translateY(220px); }
}

/* -------------------------
   RESPONSIVE MOBILE
------------------------- */
@media (max-width: 480px) {
  .beta-door-wrapper {
    width: 190px;
    height: 320px;
  }

  .door-message h2 {
    font-size: 14px;
  }

  .door-message p {
    font-size: 10px;
  }
}
</style>
