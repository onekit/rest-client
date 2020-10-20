<template>
    <div>
        <div class="ui active inverted dimmer" v-if="isLoading">
            <div class="ui text loader">Loading...</div>
        </div>
        <transition name="fade" mode="out-in" appear>
            <div class="ui positive message" v-if="shouldShowPositiveMessage" key="positive">
                User {{ this.isCreatingNewRecord ? 'created' : 'updated' }} successfully.
            </div>
            <div class="ui negative message" v-else-if="shouldShowNegativeMessage" key="negative">
              <ul id="errors">
                <div v-for="(item, index) in errors">
                  <div class="header">{{ index }}</div>
                  <ul>
                    <li v-for="subItem in item">
                      <p>{{ subItem }}</p>
                    </li>
                  </ul>
                </div>
              </ul>
            </div>
        </transition>
        <table class="ui small compact orange celled table">
            <thead v-if="!isCreatingNewRecord">
                <tr>
                    <th colspan="2">{{ user.firstName }} {{ user.lastName }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="six wide"><strong>Email</strong></td>
                    <td class="ten wide">
                        <div class="ui fluid input" v-if="isEditing">
                          <input type="text" v-model="user.email" >
                        </div>
                        <div class="ui fluid input" v-else>
                          {{ user.email }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="six wide"><strong>ID</strong></td>
                    <td class="ten wide">
                        <div class="ui fluid input">
                          {{ user.id }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="six wide"><strong>First Name</strong></td>
                    <td class="ten wide">
                        <div class="ui fluid input" v-if="isEditing">
                            <input type="text" v-model="user.firstName">
                        </div>
                        <div class="ui fluid input" v-else>
                            {{ user.firstName }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="six wide"><strong>Last Name</strong></td>
                    <td class="ten wide">
                      <div class="ui fluid input" v-if="isEditing">
                            <input type="text" v-model="user.lastName">
                        </div>
                        <div class="ui fluid input" v-else>
                            {{ user.lastName }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="six wide"><strong>Phone number</strong></td>
                    <td class="ten wide">
                        <div class="ui fluid input" v-if="isEditing">
                            <input type="text" v-model="user.phone">
                        </div>
                        <div class="ui fluid input" v-else>
                            {{ user.phone }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="six wide"><strong>Password</strong></td>
                    <td class="ten wide">
                        <div class="ui fluid input" v-if="isEditing">
                            <input type="text" v-model="user.password">
                        </div>
                        <div class="ui fluid input" v-else>
                            {{ user.password }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="ui right floated button" @click="onCancelButtonClick">
            Cancel
        </button>
        <button class="ui right floated primary button" @click="onPrimaryButtonClick">{{ primaryButtonLabel }}</button>
    </div>
</template>

<script>
import lodashStartCase from 'lodash/startCase';
import { Dropdown } from 'semantic-ui-vue2';

export default {
    components: {
        'semantic-ui-dropdown': Dropdown
    },
    data() {
        return {
            errors: [],
            isEditing: false,
            isLoading: false,
            shouldShowPositiveMessage: false,
            shouldShowNegativeMessage: false
        }
    },
    props: {
        user: {
            required: true,
            type: Object
        },
        isCreatingNewRecord: {
            required: true,
            type: Boolean
        }
    },
    computed: {
        primaryButtonLabel() {
            return this.isEditing ? 'Save' : 'Edit';
        }
    },
    methods: {
        onPrimaryButtonClick() {

            if (!this.isEditing) {
                this.isEditing = true;
                return;
            }

            this.isLoading = true;

            const payload = {
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.user.email,
                phone: this.user.phone,
                password: this.user.password,
            };

            if (this.isCreatingNewRecord) {
                payload.firstName = this.user.firstName;
                payload.lastLast = this.user.lastName;
                payload.email = this.user.email;
                payload.phone = this.user.phone;
                payload.password = this.user.password;
            }

            const errorHandler = error => {
                if (error.body.message) {
                  this.errors.push([error.body.message]);
                }
                if (error.body.errors) {
                  this.errors = error.body.errors;
                }
                this.shouldShowNegativeMessage = true;
                this.isLoading = false;
            };

            if (this.isCreatingNewRecord) {
                this.$http.post('api/users', payload).then(() => {
                    this.shouldShowPositiveMessage = true;
                    this.$store.dispatch('requestUserList');
                    this.$emit('newUserAdded');
                    this.isLoading = false;
                }, errorHandler);
            } else if (this.isEditing) {
                this.$http.put(`api/users/${this.user.id}`, payload).then(() => {
                    this.isEditing = false;
                    this.shouldShowPositiveMessage = true;
                    this.$store.dispatch('updateUserInformation', this.user.id);
                    this.isLoading = false;
                }, errorHandler);
            }
        },
        onCancelButtonClick() {
            this.resetInitialState();
            this.$emit('cancelButtonClicked');
        },
        resetInitialState() {
            this.errors = [];
            this.isEditing = false;
            this.shouldShowPositiveMessage = false;
            this.shouldShowNegativeMessage = false;
        }
    },
    filters: {
        startCase(value) {
            return lodashStartCase(value);
        }
    },
    created() {
        if (this.isCreatingNewRecord) {
            this.isEditing = true;
        }
    }
}
</script>
