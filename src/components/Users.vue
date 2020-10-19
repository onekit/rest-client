<template>
    <div class="row">
        <div class="eight wide column">
            <h2>Search Database</h2>
            <div class="ui fluid icon input">
                <input type="text" placeholder="Search..." v-model="searchQuery">
                <i class="search icon"></i>
            </div>
            <h2>Matching Users</h2>
            <div id="selection-list-wrapper">
                <div class="ui middle aligned divided selection list">
                    <div class="item" v-for="user in filteredUsers" :class="{ active: selectedUser !== null && selectedUser.id === user.id }" @click="onUserItemClick(user)">
                        <div class="content">
                            <a class="header">{{ user.firstName }} {{ user.lastName }}</a>
                            <div class="description">
                              Phone: {{ user.phone }}
                              Email: {{ user.email }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="eight wide column">
            <h2>User</h2>
            <app-user-form
                v-if="shouldShowForm"
                :isCreatingNewRecord="isCreatingNewRecord"
                :user="selectedUser"
                @cancelButtonClicked="onCancelButtonClick"
                @newUserAdded="onNewUserAdded"
            ></app-user-form>
            <div v-else>
                <p>Text.</p>
                <button class="ui olive right labeled icon button" @click="onAddButtonClick">
                    <i class="plus icon"></i>
                    Add User
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import filter from 'lodash/filter';
import { mapGetters } from 'vuex';
import UserForm from './users/UserForm.vue';

export default {
    components: {
        'app-user-form': UserForm
    },
    data() {
        return {
            isCreatingNewRecord: false,
            searchQuery: '',
            selectedUser: null
        }
    },
    computed: {
        ...mapGetters({
            users: 'getAvailableUsers'
        }),
        shouldShowForm() {
            return this.selectedUser !== null;
        },
        filteredUsers() {
            return filter(this.users, (item) => {
                const hasUserMatch = (item.firstName.toLowerCase().indexOf(this.searchQuery) !== -1);
                return hasUserMatch;
            });
        }
    },
    methods: {
        onAddButtonClick() {
            this.isCreatingNewRecord = true;
            this.selectedUser = {
                firstName: '',
                lastName: '',
                phone: ''
            };
        },
        onCancelButtonClick() {
            this.isCreatingNewRecord = false;
            this.selectedUser = null;
        },
        onUserItemClick(user) {
            this.isCreatingNewRecord = false;
            (this.selectedUser === user) ? this.selectedUser = null : this.selectedUser = user;
        },
        onNewUserAdded() {
            this.selectedUser = {
                firstName: '',
                lastName: '',
                phone: ''
            };
        }
    },
    created() {

    }
}
</script>

<style scoped>
#selection-list-wrapper {
    height: 480px;
}
.ui.selection.list {
    height: 100%;
    overflow: scroll;
}
</style>
