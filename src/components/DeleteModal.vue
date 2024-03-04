<template>
    <div class="delete-confirmation">
      <div class="overlay"></div>
      <div class="confirmation-box bg-white p-6 rounded-lg shadow-md">
        <p class="text-lg mb-4">Are you sure you want to delete?</p>
        <div class="buttons flex justify-between">
          <button @click="cancel" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none">Cancel</button>
          <button @click="deletesummary" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emits = defineEmits();
  
  const cancel = () => {
    emits('cancel');
  };
  
  const deletesummary = () => {
    emits('deletesummary');
  };

  </script>
  
  <style scoped>
  .delete-confirmation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .confirmation-box {
    /* Tailwind CSS classes */
  }
  
  .buttons {
    /* Tailwind CSS classes */
  }
  
  button {
    /* Tailwind CSS classes */
  }
  
  </style>
  