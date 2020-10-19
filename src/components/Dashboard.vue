<template>
    <div>
        <app-menu></app-menu>
        <div class="ui grid container">
            <div class="row">
                <div class="column"><!-- this row intentionally left blank --></div>
            </div>
            <transition name="fade" mode="out-in">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
import Menu from './Menu.vue';

export default {
    components: {
        'app-menu': Menu,
    },
    mounted() {
        this.$store.dispatch('requestUserList');
    }
}
</script>
