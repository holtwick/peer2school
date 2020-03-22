<template>
    <div>
        <b>Teilnehmer</b>
        <ul>
            <li v-for="peer in peers">
                {{ getPeerNameById(peer.remote) }}
            </li>
        </ul>
    </div>
</template>

<script>
    import {getPeerNameBySenderId} from '../state';

    export default {
        name: "app-peer-list",
        computed: {
            peers: function() {
                return this.state.status;
            }
        },
        methods: {
            getPeerNameById(id) {
                return getPeerNameBySenderId(id);
            },
            async mounted() {
            },
        }
    }
</script>

<style scoped>

</style>