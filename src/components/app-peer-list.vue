<template>
    <div class="rounded p-3 bg-white shadow mb-3 h-32 overflow-auto">
        <h3 class="mb-1 text-base">Teilnehmer</h3>
        <ul class="list-reset">
            <li class="block w-full px-2 py-1"
                v-for="peer in peers"
                :class="{'bg-orange-200': isPeerPointingOut(peer.remote)}"
            >
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