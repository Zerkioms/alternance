<script setup>
import Breadcrumb from 'primevue/breadcrumb';
import { ref } from 'vue';



defineProps({
    items: {
        type: Object,
        required: true
    },
    home: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div>
        <Breadcrumb :model="items" :home="home" style="border:0ch"/>
    </div>
</template>