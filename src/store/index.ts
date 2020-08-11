import Vue from "vue";
import Vuex from "vuex";
import { start, letters, numbers, submit } from "../client";

Vue.use(Vuex);

interface State {
  round: string;
  letters: LetterInfo[];
  word: LetterInfo[];
  lettersResult: LettersResult | null;
  numbers: NumberInfo[];
  numbersResult: NumbersResult | null;
  ops: (string | number)[];
}

interface LettersResult {
  answer1: string,
  defn1: string,
  answer2: string,
  defn2: string,
  won: boolean
}

interface NumbersResult {
  won: boolean
}

export interface LetterInfo {
  letter: string,
  type: 'consonant' | 'vowel',
  used: boolean,
  index: number
}

export interface NumberInfo {
  number: number,
  used: boolean,
  index: number
}

export default new Vuex.Store({
  state: {
    round: '',
    letters: [],
    word: [],
    lettersResult: null,
    numbers: [],
    numbersResult: null,
    ops: []
  } as State,
  getters: {
    letters: state => state.letters,
    consonants: (_, getters) => getters.letters.filter((l: LetterInfo) => l.type === 'consonant').length,
    vowels: (_, getters) => getters.letters.filter((l: LetterInfo) => l.type === 'vowel').length,
    total: (_, getters) => getters.vowels + getters.consonants,
    ready: (_, getters) => getters.total == 9,
    word: state => state.word.map(w => w.letter.toUpperCase()).join(''),
    lettersResult: state => state.lettersResult,
    numbers: state => state.numbers,
    ops: state => state.ops
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
      state.word = [];
      state.lettersResult = null
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
    },
    setLettersResult(state, result: LettersResult) {
      state.lettersResult = result
    },
    setNumbers(state, numbers) {
      state.numbers = numbers.map((number: number, index: number) => ({ number, index, used: false }));
    },
    clearNumbers(state) {
      state.numbers = [];
      state.numbersResult = null;
      state.ops = []
    },
    addNumber(state, numberInfo: NumberInfo) {
      state.ops.push(numberInfo.number);
      state.numbers[numberInfo.index].used = true;
    },
    addOperation(state, op: string) {
      state.ops.push(op);
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
        const answer = context.getters.word.toLowerCase();
        const response = await submit(answer);
        const json = await response.json() as LettersResult;
        context.commit('setLettersResult', json);
      }
    },
    async startNumbers(context) {
      context.commit('clearNumbers');
      context.commit('setRound', 'numbers');

      await start("numbers");
    },
    async getNumbers(context, count) {
      const response = await numbers(count);

      const json = await response.json();

      context.commit('setNumbers', json.numbers);
    },
    addNumber(context, numberInfo: NumberInfo) {
      context.commit('addNumber', numberInfo);
    },
    addOperation(context, op: string) {
      context.commit('addOperation', op);
    }
  },
  modules: {}
});
