import { defineStore } from "pinia";

const useCounters = defineStore("counters", {
  state: () => ({
    asyncRoutesMark: false,
  }),

  getters: {},

  actions: {},
});

export default useCounters;
