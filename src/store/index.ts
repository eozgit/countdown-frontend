import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface State {
  letters: LetterInfo[]
  word: LetterInfo[]
}

export interface LetterInfo {
  letter: string,
  type: 'consonant' | 'vowel',
  used: boolean,
  index: number
}

export default new Vuex.Store({
  state: {
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
    }
  },
  actions: {
    addLetter(context, args) {
      context.commit('addLetter', args)
    },
    clearLetters(context) {
      context.commit('clearLetters');
    },
    type(context, info: LetterInfo) {
      context.commit('type', info)
    },
    backspace(context) {
      context.commit('backspace')
    }
  },
  modules: {}
});
