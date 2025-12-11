<template>
  <div class="ff-wrap">
    
    <!-- ❇️ INTRO -->
    <div v-if="step === 0" class="ff-intro">
      <div class="ff-intro-globe-wrap">
        <DeckGlobe class="ff-intro-globe" />
      </div>

      <h1 class="ff-intro-title">Bienvenue dans la communauté Lyvero</h1>
      <p class="ff-intro-sub">
        Ici, les réseaux ne volent pas votre attention.<br />
        Ils élèvent vos connaissances.
      </p>

      <button class="ff-btn-primary ff-intro-btn" @click="step = 1">
        Commencer
      </button>
    </div>

    <!-- ❇️ FORMULAIRE -->
    <div v-else class="ff-card">
      <header class="ff-head">
        <span class="ff-pill">Bêta privée Lyvero</span>
        <h1 class="ff-title">Construisons ensemble un réseau utile</h1>

        <div class="ff-progress">
          <div class="ff-progress-bar">
            <div class="ff-progress-bar-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="ff-progress-label">Étape {{ step }} / {{ totalSteps }}</span>
        </div>
      </header>

      <transition name="ff-slidefade" mode="out-in">
        <div :key="step" class="ff-step">

          <!-- 1 — PAYS -->
          <div v-if="step === 1">
            <h2>Dans quel pays vivez-vous ?</h2>
            <input v-model.trim="country" class="ff-input" placeholder="France, Belgique…" />
            <button class="ff-btn-primary" :disabled="!country" @click="next">Continuer</button>
          </div>

          <!-- 2 — LANGUE -->
          <div v-else-if="step === 2">
            <h2>Quelle est votre langue maternelle ?</h2>
            <input v-model.trim="language" class="ff-input" placeholder="Français, Anglais…" />
            <button class="ff-btn-primary" :disabled="!language" @click="next">Continuer</button>
          </div>

          <!-- 3 — CRÉATEURS ÉTRANGERS -->
          <div v-else-if="step === 3">
            <h2>Regardez-vous des créateurs étrangers ?</h2>

            <div class="ff-choices ff-choices--inline">
              <button class="ff-choice" :class="{ 'ff-choice--active': foreignCreators === 'oui' }"
                      @click="selectOnly('foreignCreators','oui')">
                Oui, souvent
              </button>

              <button class="ff-choice" :class="{ 'ff-choice--active': foreignCreators === 'rarement' }"
                      @click="selectOnly('foreignCreators','rarement')">
                Parfois / rarement
              </button>

              <button class="ff-choice" :class="{ 'ff-choice--active': foreignCreators === 'non' }"
                      @click="selectOnly('foreignCreators','non')">
                Pratiquement jamais
              </button>
            </div>

            <button class="ff-btn-primary" :disabled="!foreignCreators" @click="nextAuto">Continuer</button>
          </div>

          <!-- 4 — SI rarement / non -->
          <div v-else-if="step === 4 && (foreignCreators === 'rarement' || foreignCreators === 'non')">
            <h2>Qu’est-ce qui vous freine ?</h2>
            <p class="ff-hint">Choisissez la raison qui vous ressemble le plus.</p>

            <div class="ff-choices">
              <button class="ff-choice"
                      :class="{ 'ff-choice--active': reasonForeign === 'Je ne comprends pas la langue' }"
                      @click="selectOnly('reasonForeign','Je ne comprends pas la langue')">
                Je ne comprends pas la langue
              </button>

              <button class="ff-choice"
                      :class="{ 'ff-choice--active': reasonForeign === 'Trop difficile à suivre' }"
                      @click="selectOnly('reasonForeign','Trop difficile à suivre')">
                Trop difficile à suivre
              </button>

              <button class="ff-choice"
                      :class="{ 'ff-choice--active': reasonForeign === 'Je ne trouve pas les bons créateurs' }"
                      @click="selectOnly('reasonForeign','Je ne trouve pas les bons créateurs')">
                Je ne trouve pas les bons créateurs
              </button>

              <button class="ff-choice"
                      :class="{ 'ff-choice--active': reasonForeign === 'Ça ne m’intéresse pas' }"
                      @click="selectOnly('reasonForeign','Ça ne m’intéresse pas')">
                Ça ne m’intéresse pas
              </button>
            </div>

            <textarea v-model.trim="reasonForeign" class="ff-textarea"
                      placeholder="Vous pouvez préciser ou ajouter une autre raison (facultatif)…"></textarea>

            <button class="ff-btn-primary" @click="nextAuto">Continuer</button>
          </div>

          <!-- 4bis — SI oui -->
          <div v-else-if="step === 4 && foreignCreators === 'oui'">
            <h2>Aimeriez-vous les comprendre instantanément ?</h2>

            <div class="ff-choices ff-choices--inline">
              <button class="ff-choice" :class="{ 'ff-choice--active': wish === 'oui' }"
                      @click="selectAndNext('wish','oui')">
                Oui, ce serait idéal
              </button>

              <button class="ff-choice" :class="{ 'ff-choice--active': wish === 'non' }"
                      @click="selectAndNext('wish','non')">
                Pas spécialement
              </button>
            </div>
          </div>

          <!-- 5 — Pourquoi pas -->
          <div v-else-if="step === 5 && wish === 'non'">
            <h2>Pourquoi ce n’est pas une priorité pour vous ?</h2>
            <textarea v-model.trim="reasonWish" class="ff-textarea"
                      placeholder="Expliquez en quelques mots…"></textarea>

            <button class="ff-btn-primary" @click="next">Continuer</button>
          </div>

          <!-- 6 — RÉSEAU PRÉFÉRÉ -->
          <div v-else-if="step === 6">
            <h2>Quel réseau social utilisez-vous le plus ?</h2>

            <div class="ff-choices">
              <button class="ff-choice" :class="{ 'ff-choice--active': favorite === 'TikTok' }"
                      @click="selectOnly('favorite','TikTok')">TikTok</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': favorite === 'Instagram' }"
                      @click="selectOnly('favorite','Instagram')">Instagram</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': favorite === 'YouTube' }"
                      @click="selectOnly('favorite','YouTube')">YouTube</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': favorite === 'Facebook' }"
                      @click="selectOnly('favorite','Facebook')">Facebook</button>
            </div>

            <textarea v-model.trim="favoriteWhy" class="ff-textarea"
                      placeholder="Ce que vous aimez / ce qui vous agace…"></textarea>

            <button class="ff-btn-primary" :disabled="!favorite" @click="next">Continuer</button>
          </div>

          <!-- 7 — PROBLÈMES DES RÉSEAUX -->
          <div v-else-if="step === 7">
            <h2>Qu’est-ce qui manque le plus aux réseaux ?</h2>
            <p class="ff-hint">Sélection multiple possible</p>

            <div class="ff-choices">
              <button class="ff-choice" :class="{ 'ff-choice--active': problem.includes('Moins de toxicité') }"
                      @click="toggle(problem, 'Moins de toxicité')">
                Moins de toxicité / drama
              </button>

              <button class="ff-choice" :class="{ 'ff-choice--active': problem.includes('Meilleure visibilité') }"
                      @click="toggle(problem, 'Meilleure visibilité')">
                Meilleure visibilité pour les créateurs sérieux
              </button>

              <button class="ff-choice" :class="{ 'ff-choice--active': problem.includes('Moins de désinformation') }"
                      @click="toggle(problem, 'Moins de désinformation')">
                Moins de désinformation
              </button>

              <button class="ff-choice" :class="{ 'ff-choice--active': problem.includes('Plus d’outils pour créateurs') }"
                      @click="toggle(problem, 'Plus d’outils pour créateurs')">
                Plus d’outils pour apprendre / créer
              </button>
            </div>

            <textarea v-model.trim="problemOther" class="ff-textarea"
                      placeholder="Autre idée ?"></textarea>

            <button class="ff-btn-primary" @click="next">Continuer</button>
          </div>

          <!-- 8 — BOOSTS -->
          <div v-else-if="step === 8">
            <h2>Avez-vous déjà utilisé des boosts ?</h2>

            <div class="ff-choices">
              <button class="ff-choice"
                      :class="{ 'ff-choice--active': boost.includes('Boost TikTok') }"
                      @click="toggle(boost,'Boost TikTok')">Boost TikTok</button>

              <button class="ff-choice"
                      :class="{ 'ff-choice--active': boost.includes('Boost Instagram') }"
                      @click="toggle(boost,'Boost Instagram')">Boost Instagram</button>

              <button class="ff-choice"
                      :class="{ 'ff-choice--active': boost.includes('Meta Business') }"
                      @click="toggle(boost,'Meta Business')">Meta Business</button>

              <button class="ff-choice"
                      :class="{ 'ff-choice--active': boost.includes('Jamais utilisé') }"
                      @click="toggle(boost,'Jamais utilisé')">Jamais utilisé</button>
            </div>

            <textarea v-model.trim="boostWhy" class="ff-textarea"
                      placeholder="Pourquoi / objectif…"></textarea>

            <button class="ff-btn-primary" @click="next">Continuer</button>
          </div>

          <!-- 9 — OBJECTIF -->
          <div v-else-if="step === 9">
            <h2>Quel est votre objectif principal ?</h2>

            <div class="ff-choices">
              <button class="ff-choice" :class="{ 'ff-choice--active': goal === 'Apprendre' }"
                      @click="selectOnly('goal','Apprendre')">Apprendre</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': goal === 'Divertissement' }"
                      @click="selectOnly('goal','Divertissement')">Me divertir</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': goal === 'Créer du contenu' }"
                      @click="selectOnly('goal','Créer du contenu')">Créer du contenu</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': goal === 'Vendre / business' }"
                      @click="selectOnly('goal','Vendre / business')">Vendre / business</button>
            </div>

            <textarea v-model.trim="selfQuote" class="ff-textarea ff-textarea--small"
                      placeholder="Décrivez en une phrase le réseau idéal…"></textarea>

            <button class="ff-btn-primary" :disabled="!goal" @click="next">Continuer</button>
          </div>

          <!-- 10 — BÊTA -->
          <div v-else-if="step === 10">
            <h2>Souhaitez-vous rejoindre la bêta privée Lyvero ?</h2>

            <div class="ff-choices ff-choices--inline">
              <button class="ff-choice" :class="{ 'ff-choice--active': beta === 'oui' }"
                      @click="selectOnly('beta','oui')">Oui</button>

              <button class="ff-choice" :class="{ 'ff-choice--active': beta === 'non' }"
                      @click="selectOnly('beta','non')">Non</button>
            </div>

            <button class="ff-btn-primary" :disabled="!beta" @click="next">Continuer</button>
          </div>

          <!-- 11 — EMAIL SI OUI -->
          <div v-else-if="step === 11 && beta === 'oui'">
            <h2>Où pouvons-nous vous écrire ?</h2>

            <input
              v-model.trim="email"
              class="ff-input"
              placeholder="email@example.com"
              autocapitalize="none"
              autocorrect="off"
              inputmode="email"
            />

            <button class="ff-btn-primary" :disabled="!isValidEmail" @click="submit">
              Valider et rejoindre la bêta
            </button>
          </div>

          <!-- 11 — FIN SI NON -->
          <div v-else-if="step === 11 && beta === 'non'">
            <h2>Merci 🙌</h2>
            <p class="ff-end-text">
              Votre avis nous aide à construire un réseau meilleur.
            </p>

            <button class="ff-btn-primary" @click="submit">
              Terminer
            </button>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import DeckGlobe from './DeckGlobe.vue'
import emailjs from '@emailjs/browser'
import { useRuntimeConfig } from 'nuxt/app'

const cfg = useRuntimeConfig()
emailjs.init(cfg.public.EMAILJS_PUBLIC)

const emit = defineEmits(['complete'])

/* ---------------- STATE ---------------- */
const step = ref(0)
const totalSteps = 11

const country = ref('')
const language = ref('')
const foreignCreators = ref('')
const reasonForeign = ref('')

const wish = ref('')
const reasonWish = ref('')

const favorite = ref('')
const favoriteWhy = ref('')

const problem = ref<string[]>([])
const problemOther = ref('')

const boost = ref<string[]>([])
const boostWhy = ref('')

const goal = ref('')
const selfQuote = ref('')

const beta = ref('')
const email = ref('')

/* ---------------- PROGRESS ---------------- */
const progress = computed(() =>
  step.value === 0 ? 0 : (step.value / totalSteps) * 100
)

/* ---------------- HELPERS ---------------- */
function next() {
  if (step.value < totalSteps) step.value++
}

// skip auto step for foreign creators
function nextAuto() {
  if (
    step.value === 4 &&
    (foreignCreators.value === 'rarement' || foreignCreators.value === 'non')
  ) {
    step.value = 6
    return
  }
  next()
}

/* --- NO AUTO-NEXT SELECTOR (UX FIX) --- */
function selectOnly(field: string, value: string) {
  if (field === 'foreignCreators') foreignCreators.value = value
  else if (field === 'wish') wish.value = value
  else if (field === 'favorite') favorite.value = value
  else if (field === 'goal') goal.value = value
  else if (field === 'beta') beta.value = value
}

/* --- LEGACY SELECT + AUTO NEXT (KEEP ONLY WHERE NEEDED) --- */
function selectAndNext(field: string, value: string) {
  selectOnly(field, value)

  if (field === 'wish' && value === 'oui') {
    if (step.value < 6) step.value = 6
    return
  }

  next()
}

function setReasonForeign(v: string) {
  reasonForeign.value = v
  nextAuto()
}

function toggle(arr: string[], value: string) {
  const i = arr.indexOf(value)
  if (i === -1) arr.push(value)
  else arr.splice(i, 1)
}

const isValidEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

/* ---------------- SUBMIT ---------------- */
async function submit() {
  try {
    await emailjs.send(cfg.public.EMAILJS_SERVICE, cfg.public.EMAILJS_TEMPLATE, {
      country: country.value,
      language: language.value,
      foreignCreators: foreignCreators.value,
      reasonForeign: reasonForeign.value || problemOther.value,
      wish: wish.value,
      reasonWish: reasonWish.value,
      favorite: favorite.value,
      favoriteWhy: favoriteWhy.value,
      problem: problem.value.join(', '),
      problemOther: problemOther.value,
      boost: boost.value.join(', '),
      boostWhy: boostWhy.value,
      goal: goal.value,
      selfQuote: selfQuote.value,
      beta: beta.value,
      email: email.value || 'non fourni'
    })
  } catch (e) {
    console.error('EmailJS error:', e)
  }

  emit('complete')
}
</script>


<style scoped>
/* ========== GLOBAL WRAP ========== */
.ff-wrap {
  min-height: 100vh;
  padding: 22px 16px;
  background: radial-gradient(circle at top, #071d24 0%, #00080f 80%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eafff8;
}

/* ========== INTRO SCREEN ========== */
.ff-intro {
  text-align: center;
  max-width: 420px;
  width: 100%;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: fadeIn 0.35s ease-out;
}

.ff-intro-globe-wrap {
  position: relative;
  width: 230px;
  aspect-ratio: 1 / 1;
  margin: 0 auto 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.ff-intro-globe-wrap::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 200, 0.08), transparent 70%);
  border: 1px solid rgba(0, 255, 200, 0.15);
  animation: pulseGlow 1s infinite ease-in-out;
}

.ff-intro-globe {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes pulseGlow {
  0% {
    opacity: 0.35;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.95;
    transform: scale(1);
  }
  100% {
    opacity: 0.35;
    transform: scale(0.96);
  }
}

.ff-intro-title {
  font-size: 22px;
  font-weight: 600;
  margin: 4px 0 10px;
}

.ff-intro-sub {
  font-size: 14px;
  color: #aef3e0;
  line-height: 1.45;
  margin-bottom: 26px;
  max-width: 300px;
}

.ff-intro-btn {
  padding: 12px 26px;
}

/* ========== FORM CARD ========== */
.ff-card {
  background: rgba(4, 22, 28, 0.7);
  border: 1px solid rgba(0, 255, 180, 0.16);
  border-radius: 26px;
  padding: 28px 22px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 0 25px rgba(0, 255, 170, 0.12),
    inset 0 0 12px rgba(0, 255, 170, 0.08);
  backdrop-filter: blur(14px);
  animation: floatIn 0.45s ease-out;
  transform-origin: top center;
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(25px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ========== HEADER ========== */
.ff-head {
  margin-bottom: 22px;
}

.ff-pill {
  font-size: 12px;
  padding: 5px 12px;
  background: rgba(0, 255, 200, 0.15);
  border: 1px solid rgba(0, 255, 200, 0.35);
  border-radius: 999px;
  display: inline-block;
  margin-bottom: 8px;
}

.ff-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #00ffbf;
  text-shadow: 0 0 12px rgba(0, 255, 170, 0.45);
}

/* ========== PROGRESS BAR ========== */
.ff-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ff-progress-bar {
  flex: 1;
  height: 5px;
  background: rgba(0, 255, 170, 0.15);
  border-radius: 999px;
  overflow: hidden;
  margin-right: 12px;
}

.ff-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffc0, #00ddff);
  border-radius: 999px;
  transition: width 0.35s ease;
}

.ff-progress-label {
  font-size: 13px;
  opacity: 0.8;
}

/* ========== TITLE OF STEP ========== */
h2 {
  font-size: 18px;
  margin: 12px 0 4px;
  color: #00ffc3;
}

/* Petit sous-texte (multi-sélection, etc.) */
.ff-hint {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
}

/* ========== INPUTS ========== */
.ff-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(0, 40, 45, 0.85);
  border: 1px solid rgba(0, 255, 170, 0.35);
  border-radius: 14px;
  font-size: 15px;
  color: #eafff8;
  outline: none;
  transition: 0.25s;
}

.ff-input::placeholder {
  color: rgba(180, 230, 220, 0.7);
}

.ff-input:focus {
  border-color: #00ffd5;
  box-shadow: 0 0 10px rgba(0, 255, 180, 0.4);
}

/* ========== CHOICE BUTTONS ========== */
.ff-choices {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.ff-choices--inline {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ff-choice {
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(0, 255, 160, 0.09);
  border: 1px solid rgba(0, 255, 160, 0.25);
  color: #dffff6;
  font-size: 15px;
  transition: 0.18s ease;
  text-align: left;
}

.ff-choice:hover {
  background: rgba(0, 255, 190, 0.16);
  transform: translateY(-1px);
}

/* ÉTAT SÉLECTIONNÉ (multi + oui/non) */
.ff-choice--active {
  background: radial-gradient(circle at top, rgba(0, 255, 210, 0.35), rgba(0, 255, 160, 0.12));
  border-color: rgba(0, 255, 230, 0.85);
  box-shadow: 0 0 12px rgba(0, 255, 210, 0.45);
}

/* ========== PRIMARY BUTTON ========== */
.ff-btn-primary {
  margin-top: 12px;
  padding: 14px;
  background: linear-gradient(130deg, #00ffd5, #00aaff);
  border-radius: 16px;
  font-weight: 700;
  font-size: 15px;
  color: #001013;
  border: none;
  width: 100%;
  transition: 0.25s;
  box-shadow: 0 6px 22px rgba(0, 255, 210, 0.35);
}

.ff-btn-primary:hover:not(:disabled) {
  box-shadow: 0 8px 30px rgba(0, 255, 230, 0.55);
  transform: translateY(-2px);
}

.ff-btn-primary:disabled {
  opacity: 0.45;
  box-shadow: none;
}

/* ========== TEXTAREA ========== */
.ff-textarea {
  margin-top: 12px;
  padding: 12px 14px;
  min-height: 110px;
  background: rgba(0, 40, 45, 0.9);
  border: 1px solid rgba(0, 255, 170, 0.32);
  border-radius: 14px;
  font-size: 14px;
  color: #eafff8;
  outline: none;
  resize: vertical;
  transition: 0.25s;
}

.ff-textarea--small {
  min-height: 80px;
}

.ff-textarea::placeholder {
  color: rgba(175, 230, 220, 0.65);
}

.ff-textarea:focus {
  border-color: #00ffd5;
  box-shadow: 0 0 10px rgba(0, 255, 180, 0.4);
}

/* ========== STEP TRANSITION ========== */
.ff-step {
  animation: fadeStep 0.35s ease;
}

@keyframes fadeStep {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SLIDE + FADE TRANSITION */
.ff-slidefade-enter-active,
.ff-slidefade-leave-active {
  transition: all 0.35s ease;
}

.ff-slidefade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.97);
}

.ff-slidefade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
</style>

