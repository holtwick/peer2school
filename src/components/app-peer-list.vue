<template>
    <div>
        <b>Teilnehmer</b>
        <ul class="app-peer-list">
            <li v-for="peer in peers">
                <img v-if="isPeerPointingOut(peer.remote)" src="../assets/img/aufzeigen.png" height="15" width="15" />
                {{ getPeerNameById(peer.remote) }}
            </li>
        </ul>
    </div>
</template>

<script>
    import {getPeerNameBySenderId, state} from '../state';

    export default {
        name: "app-peer-list",
        computed: {
            peers: function () {
                return this.state.status;
            }
        },
        methods: {
            getPeerNameById(id) {
                return getPeerNameBySenderId(id);
            },
            isPeerPointingOut(id) {
               if(this.state.pointOuts.includes(id)) { return true;}
                return false;
            },
            async mounted() {
            },
        }
    }
</script>

<style scoped lang="scss">
    ul.app-peer-list {
        list-style-type: none;
        margin: 0;
        li {
            hyphens: auto;
            margin: 0;
            padding: 3px 0;
            border-bottom: 1px solid #ddd;
            &:last-of-type {
                border-bottom: 0;
            }
        }
    }
</style>