import findIndex from 'lodash/findIndex';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    isAuthenticated: false,
    authErrorMessage: '',
    availableUsers: []
};

const getters = {
    getAvailableUsers: state => state.availableUsers,
    getIsAuthenticated: state => {
        return state.isAuthenticated;
    }
};

const actions = {
    requestUserList({ commit }) {
        Vue.http.get('api/users').then(response => {
            commit('setAvailableUsers', response.body);
        });
    },

    updateUserInformation({ commit }, userId) {
        Vue.http.get(`api/users/${userId}`).then(response => {
            commit('updateUser', response.body);
        });
    },
    renewToken({ commit }, oldAuthToken) {
        console.log('renew token');
        Vue.http.post('login_check', { token: oldAuthToken }).then(response => {
            localStorage.setItem('authToken', response.body.token);
            commit('setIsAuthenticated', true);
        });
    }
};

const mutations = {
    setIsAuthenticated(state, isAuthenticated) {
        state.isAuthenticated = isAuthenticated;
        state.authErrorMessage = '';
    },
    setAvailableUsers(state, users = []) {
        state.availableUsers = users;
    },
    updateUser(state, newUser) {
        const index = findIndex(state.availableUsers, oldUser => oldUser.id === newUser.id);
        state.availableUsers.splice(index, 1, newUser);
    }
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
