import Vue from "vue";
import Vuex from "vuex";
import { start, letters, numbers, submit } from "../client";
import { calculateNumbers, getInfix } from "../common";

Vue.use(Vuex);

interface State {
  round: string;
  letters: LetterInfo[];
  word: LetterInfo[];
  lettersResult: LettersResult | null;
  originalNumbers: number[];
  numbers: NumberInfo[];
  numbersResult: NumbersResult | null;
  ops: number[];
  target: number;
}

interface LettersResult {
  answer1: string;
  defn1: string;
  answer2: string;
  defn2: string;
  won: boolean;
}

interface NumbersResult {
  answer1: string;
  away1: string;
  answer2: string;
  away2: string;
  won: boolean;
}

export interface LetterInfo {
  letter: string;
  type: "consonant" | "vowel";
  used: boolean;
  index: number;
}

export interface NumberInfo {
  number: number;
  used: boolean;
  index: number;
}

export default new Vuex.Store({
  state: {
    round: "",
    letters: [],
    word: [],
    lettersResult: null,
    originalNumbers: [],
    numbers: [],
    numbersResult: null,
    ops: [],
    target: -1
  } as State,
  getters: {
    letters: state => state.letters,
    consonants: (_, getters) =>
      getters.letters.filter((l: LetterInfo) => l.type === "consonant").length,
    vowels: (_, getters) =>
      getters.letters.filter((l: LetterInfo) => l.type === "vowel").length,
    total: (_, getters) => getters.vowels + getters.consonants,
    ready: (_, getters) => getters.total == 9,
    word: state => state.word.map(w => w.letter.toUpperCase()).join(""),
    lettersResult: state => state.lettersResult,
    numbers: state => state.numbers,
    ops: state => state.ops,
    originalNumbers: state => state.originalNumbers,
    target: state => state.target,
    away: (_, getters) =>
      getters.numbers.length > 6
        ? Math.abs(
          getters.numbers[getters.numbers.length - 1].number - getters.target
        )
        : null,
    numbersResult: state => state.numbersResult
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
      state.lettersResult = null;
    },
    type(state, info: LetterInfo) {
      state.word.push(info);
      state.letters[info.index].used = true;
    },
    backspace(state) {
      if (state.round === "letters") {
        if (state.word.length) {
          const len = state.word.length - 1;
          const info = state.word[len];
          state.word = state.word.slice(0, len);
          state.letters[info.index].used = false;
        }
      } else {
        if (state.ops.length) {
          state.ops = state.ops.slice(0, state.ops.length - 1);
        }
      }
    },
    setRound(state, round: "letters" | "numbers") {
      state.round = round;
    },
    setLettersResult(state, result: LettersResult) {
      state.lettersResult = result;
    },
    setOriginalNumbers(state, numbers) {
      state.originalNumbers = numbers;
    },
    clearNumbers(state) {
      state.numbers = [];
      state.numbersResult = null;
      state.ops = [];
    },
    append(state, op: number) {
      state.ops.push(op);
    },
    setNumbers(state, numbers: NumberInfo[]) {
      state.numbers = numbers;
    },
    setTarget(state, target: number) {
      state.target = target;
    },
    setNumbersResult(state, result: NumbersResult) {
      state.numbersResult = result;
    }
  },
  actions: {
    async getLetter(context, type) {
      const response = await letters(type);

      if (response.ok) {
        const { letter } = await response.json();

        context.commit("addLetter", { letter, type });
      }
    },
    async startLetters(context) {
      context.commit("clearLetters");
      context.commit("setRound", "letters");

      await start("letters");
    },
    type(context, info: LetterInfo) {
      context.commit("type", info);
    },
    backspace(context) {
      context.commit("backspace");
      if (context.state.round === "numbers") {
        context.dispatch("recalculateNumbers");
      }
    },
    async submit(context) {
      if (context.state.round === "letters") {
        const answer = context.getters.word.toLowerCase();
        const response = await submit(answer);
        const json = (await response.json()) as LettersResult;
        context.commit("setLettersResult", json);
      } else {
        const infix = getInfix(
          context.state.originalNumbers,
          context.state.ops
        );
        const response = await submit(infix);
        const json = (await response.json()) as NumbersResult;
        context.commit("setNumbersResult", json);
      }
    },
    async startNumbers(context) {
      context.commit("clearNumbers");
      context.commit("setRound", "numbers");

      await start("numbers");
    },
    async getNumbers(context, count) {
      const response = await numbers(count);

      const json = await response.json();

      context.commit("setOriginalNumbers", json.numbers);
      context.commit("setTarget", json.target);

      context.dispatch("recalculateNumbers");
    },
    append(context, op: number) {
      context.commit("append", op);
    },
    setNumbers(context, numbers) {
      context.commit("setNumbers", numbers);
    },
    recalculateNumbers(context) {
      const nos: NumberInfo[] = calculateNumbers(
        context.getters.originalNumbers,
        context.getters.ops
      );

      context.commit("setNumbers", nos);
    }
  },
  modules: {}
});
