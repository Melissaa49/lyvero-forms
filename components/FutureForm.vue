<template>
  <div class="ff-wrap">
    <div class="ff-card">
      <transition name="fade" mode="out-in">
        <div :key="step" class="ff-step">

          <!-- STEP 1 : PAY -->
          <div v-if="step === 1">
            <h2>Dans quel pays vivez-vous ?</h2>
            <input v-model="country" placeholder="Ex : France, Brésil..." />
            <button :disabled="!country" @click="next">Continuer</button>
          </div>

          <!-- STEP 2 : LANGUE -->
          <div v-else-if="step === 2">
            <h2>Quelle est votre langue maternelle ?</h2>
            <input v-model="language" placeholder="Ex : Français, Portugais..." />
            <button :disabled="!language" @click="next">Continuer</button>
          </div>

          <!-- STEP 3 : CREATEURS ETRANGERS -->
          <div v-else-if="step === 3">
            <h2>Regardez-vous des créateurs étrangers ?</h2>
            <div class="ff-choices">
              <button @click="choose('foreignCreators','oui')">Oui</button>
              <button @click="choose('foreignCreators','rarement')">Rarement</button>
              <button @click="choose('foreignCreators','non')">Non</button>
            </div>
          </div>

          <!-- STEP 3B : POURQUOI (si rarement / non) -->
          <div v-else-if="step === 4 && (foreignCreators === 'rarement' || foreignCreators === 'non')">
            <h2>Pourquoi&nbsp;?</h2>
            <div class="ff-choices">
              <button @click="reasonForeign = 'je ne comprends pas la langue'; next()">Je ne comprends pas la langue</button>
              <button @click="reasonForeign = 'je dois trop me concentrer'; next()">Trop difficile à suivre</button>
              <button @click="reasonForeign = 'je ne trouve pas de créateurs'; next()">Je ne trouve pas les bons créateurs</button>
              <button @click="reasonForeign = 'pas d’intérêt'; next()">Ça ne m’intéresse pas</button>
            </div>
            <textarea v-model="reasonForeign" placeholder="Autre raison (optionnel)" class="ff-textarea"></textarea>
            <button @click="next">Continuer</button>
          </div>

          <!-- STEP 4 : AIMERAIS COMPRENDRE -->
          <div v-else-if="step === 4 && foreignCreators === 'oui'">
            <h2>Aimeriez-vous pouvoir les comprendre instantanément&nbsp;?</h2>
            <div class="ff-choices">
              <button @click="choose('wish','oui')">Oui</button>
              <button @click="choose('wish','non')">Non</button>
            </div>
          </div>

          <!-- STEP 4B : POURQUOI comprendre = non -->
          <div v-else-if="step === 5 && wish === 'non'">
            <h2>Pourquoi&nbsp;?</h2>
            <textarea v-model="reasonWish" placeholder="Expliquez en quelques mots..." class="ff-textarea"></textarea>
            <button @click="next">Continuer</button>
          </div>

          <!-- STEP 5 : PROBLÈME RESEAUX -->
          <div v-else-if="step === 5">
            <h2>Qu’est-ce qui vous dérange le plus sur les réseaux sociaux&nbsp;?</h2>

            <div class="ff-choices">
              <button @click="pushOrToggle(problem,'toxicité')">Toxicité</button>
              <button @click="pushOrToggle(problem,'harcèlement')">Harcèlement</button>
              <button @click="pushOrToggle(problem,'désinformation')">Désinformation</button>
              <button @click="pushOrToggle(problem,'superficialité')">Trop superficiels</button>
              <button @click="pushOrToggle(problem,'addiction')">Addiction</button>
              <button @click="pushOrToggle(problem,'apprendre')">Pas adapté pour apprendre</button>
              <button @click="pushOrToggle(problem,'culture')">Peu de diversité culturelle</button>
            </div>

            <textarea v-model="problemOther" placeholder="Autre problématique (optionnel)" class="ff-textarea"></textarea>

            <button @click="next">Continuer</button>
          </div>

          <!-- STEP 6 : CE QUI MANQUE -->
          <div v-else-if="step === 6">
            <h2>Qu’est-ce qui manque aujourd’hui sur les réseaux&nbsp;?</h2>

            <div class="ff-choices">
              <button @click="pushOrToggle(needs,'connaissances')">Plus de connaissances</button>
              <button @click="pushOrToggle(needs,'lives pedagogiques')">Lives pédagogiques</button>
              <button @click="pushOrToggle(needs,'traduction')">Traduction instantanée</button>
              <button @click="pushOrToggle(needs,'experts')">Créateurs experts</button>
              <button @click="pushOrToggle(needs,'monde')">Communauté mondiale</button>
              <button @click="pushOrToggle(needs,'sens')">Moins de bruit, plus de sens</button>
            </div>

            <textarea v-model="needsOther" placeholder="Autres idées (optionnel)" class="ff-textarea"></textarea>

            <button @click="next">Continuer</button>
          </div>

          <!-- STEP 7 : BETA TEST -->
          <div v-else-if="step === 7">
            <h2>Voulez-vous rejoindre la bêta privée Lyvero&nbsp;?</h2>

            <div class="ff-choices">
              <button @click="choose('beta','oui')">Oui</button>
              <button @click="choose('beta','non')">Non</button>
            </div>
          </div>

          <!-- STEP 8 : EMAIL (si oui) -->
          <div v-else-if="step === 8 && beta === 'oui'">
            <h2>Laissez votre email pour recevoir l’accès</h2>
            <input type="email" v-model="email" placeholder="votre.email@example.com" />
            <button :disabled="!email" @click="submit">Valider</button>
          </div>

          <!-- STEP 8 : FIN (si non) -->
          <div v-else-if="step === 8 && beta === 'non'">
            <h2>Merci pour vos réponses.</h2>
            <button @click="submit">Terminer</button>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import emailjs from '@emailjs/browser'
import { useRuntimeConfig } from 'nuxt/app'

const cfg = useRuntimeConfig()
const emit = defineEmits(['complete'])

/* DATA */
const step = ref(1)
const country = ref('')
const language = ref('')
const foreignCreators = ref('')
const wish = ref('')
const beta = ref('')
const email = ref('')

const reasonForeign = ref('')
const reasonWish = ref('')
const problem = ref<string[]>([])
const problemOther = ref('')
const needs = ref<string[]>([])
const needsOther = ref('')

/* HELPERS */
function next() { step.value++ }

function choose(field: string, value: string) {
  if (field === 'foreignCreators') foreignCreators.value = value
  if (field === 'wish') wish.value = value
  if (field === 'beta') beta.value = value
  next()
}

function pushOrToggle(arr: string[], val: string) {
  if (arr.includes(val)) {
    arr.splice(arr.indexOf(val), 1)
  } else arr.push(val)
}

async function submit() {
  await emailjs.send(
  cfg.public.EMAILJS_SERVICE as string,
  cfg.public.EMAILJS_TEMPLATE as string,
    {
      country: country.value,
      language: language.value,
      foreignCreators: foreignCreators.value,
      reasonForeign: reasonForeign.value,
      wish: wish.value,
      reasonWish: reasonWish.value,
      problem: problem.value.join(', '),
      problemOther: problemOther.value,
      needs: needs.value.join(', '),
      needsOther: needsOther.value,
      beta: beta.value,
      email: email.value || 'non fourni',
    },
  cfg.public.EMAILJS_PUBLIC as string
  )

  emit('complete')
}
</script>

<style scoped>
/* Futuristic step form */
.ff-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}
.ff-card {
  width: 100%;
  max-width: 420px;
  background: rgba(3,12,15,0.8);
  border: 1px solid rgba(0,255,160,0.25);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  padding: 28px 24px;
  color: #dffff4;
}
h2 {
  font-size: 20px;
  text-align: center;
  color: #00ffd0;
  margin-bottom: 20px;
}
input, textarea {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,255,170,0.25);
  background: rgba(0,255,170,0.12);
  color: #dffff4;
  outline: none;
}
.ff-textarea {
  margin-top: 10px;
  min-height: 90px;
}
button {
  margin-top: 18px;
  width: 100%;
  padding: 12px;
  background: #00ffc8;
  color: #000;
  font-weight: bold;
  border-radius: 10px;
}
.ff-choices {
  display: grid;
  gap: 10px;
}
.ff-choices button {
  background: rgba(0,255,160,0.15);
  color: #dffff4;
  border: 1px solid rgba(0,255,160,0.3);
}
.fade-enter-active, .fade-leave-active {
  transition: 0.3s ease;
}
.fade-enter-from {
  opacity: 0; transform: translateY(14px);
}
.fade-leave-to {
  opacity: 0; transform: translateY(-14px);
}
</style>
