import Vue from "vue";
import Vuex from "vuex";
import { start, letters, submit } from "../client";

Vue.use(Vuex);

interface State {
  round: string;
  letters: LetterInfo[];
  word: LetterInfo[];
}

export interface LetterInfo {
  letter: 'letters' | 'numbers',
  type: 'consonant' | 'vowel',
  used: boolean,
  index: number
}

export default new Vuex.Store({
  state: {
    round: '',
    letters: [],
    word: []
  } as State,
  getters: {
    letters: state => state.letters,
    consonants: (_, getters) => getters.letters.filter((l: LetterInfo) => l.type === 'consonant').length,
    vowels: (_, getters) => getters.letters.filter((l: LetterInfo) => l.type === 'vowel').length,
    total: (_, getters) => getters.vowels + getters.consonants,
    ready: (_, getters) => getters.total == 9,
    word: state => state.word.map(w => w.letter.toUpperCase()).join('')
  },
  mutations: {
    addLetter(state, { letter, type }) {
      if (state.letters.length < 9) {
        state.letters.push({
          letter,
          type,
          used: false,
          index: state.letters.length
        });
      }
    },
    clearLetters(state) {
      state.letters = [];
      state.word = []
    },
    type(state, info: LetterInfo) {
      state.word.push(info)
      state.letters[info.index].used = true
    },
    backspace(state) {
      if (state.word.length) {
        const len = state.word.length - 1
        const info = state.word[len]
        state.word = state.word.slice(0, len)
        state.letters[info.index].used = false
      }
    },
    setRound(state, round: 'letters' | 'numbers') {
      state.round = round;
    }
  },
  actions: {
    async getLetter(context, type) {
      const response = await letters(type);

      const { letter } = await response.json();

      context.commit('addLetter', { letter, type })
    },
    async startLetters(context) {
      context.commit('clearLetters');
      context.commit('setRound', 'letters');

      await start("letters");
    },
    type(context, info: LetterInfo) {
      context.commit('type', info);
    },
    backspace(context) {
      context.commit('backspace');
    },
    async submit(context) {
      if (context.state.round === 'letters') {
        const answer = context.getters.word;
        const response = await submit(answer);
        const json = await response.json();
      }
    }
  },
  modules: {}
});
