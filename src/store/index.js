import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export const identityTypes = {
  application: {
    name: 'application',
    value: 1,
  },
  user: {
    name: 'user',
    value: 2,
  },
};

const getDefaultState = () => ({
  identities: {
    user: [],
    application: [],
  },
  names: {},
  contracts: [],
  documents: {},
});

export default new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    addIdentity(state, { identity, type }) {
      if (state.identities[type.name]) {
        state.identities[type.name].push(identity);
      } else {
        state.identities = {
          user: [],
          application: [],
        };
        state.identities[type.name].push(identity);
      }
    },
    addName(state, { identity, name }) {
      const { id } = identity;
      const names = state.names[id] || [];
      state.names = {
        ...state.names,
        [id]: [
          ...names,
          name,
        ],
      };
    },
    addContract(state, { id, identity }) {
      state.contracts.push({
        id,
        identity,
        contract: null,
      });
    },
    updateContract(state, { selectedContract, contract }) {
      const { id } = selectedContract;
      console.log(state.contracts.find(v => id === v.id));
      state.contracts.find(v => id === v.id).contract = contract;
    },
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    async createIdentity({ commit }, type) {
      const identity = await new Promise((resolve) => {
        setTimeout(() => resolve({ id: `t_${type.name}_id_${Date.now()}`, type }), 2000);
      });
      commit('addIdentity', { identity, type });
    },
    async registerName({ commit }, { identity, name }) {
      await new Promise((resolve) => {
        setTimeout(() => resolve(name), 2000);
      });
      commit('addName', { identity, name });
    },
    async initContract({ commit }, { identity }) {
      const id = `t_contract_id_${Date.now()}`;
      commit('addContract', { id, identity });
    },
    async registerContract({ commit }, { selectedContract, json }) {
      const contract = await new Promise((resolve) => {
        setTimeout(() => resolve(json), 2000);
      });
      commit('updateContract', { selectedContract, contract });
    },
    async removeAllData({ commit }) {
      commit('resetState');
    },
  },
  getters: {
    identityLists(state) {
      const { identities } = state;
      return Object.keys(identityTypes).map(typeName => ({
        type: identityTypes[typeName],
        items: identities[typeName],
      }));
    },
    userIdentitiesWithNames(state) {
      const { user } = state.identities;
      return user.map(identity => ({
        ...identity,
        names: state.names[identity.id] || [],
      }));
    },
    applicationIdentitiesWithContracts(state) {
      const { application } = state.identities;
      return application.map(identity => ({
        ...identity,
        contract: state.contracts.filter(contract => identity.id === contract.identity),
      }));
    },
  },
  plugins: [createPersistedState()],
});
