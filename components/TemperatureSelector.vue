<script setup lang="ts">
defineProps<{
  modelValue: number;
}>();

defineEmits<{
  (e: "update:modelValue", payload: number): void;
}>();
</script>

<template>
  <input
    :value="modelValue"
    type="range"
    max="1"
    min="0"
    step=".1"
    class="w-full range range-secondary"
    @input="
      $emit(
        'update:modelValue',
        Number(($event.target as HTMLInputElement).value)
      )
    "
  />
  <span>Temperature: {{ modelValue }}</span>
  <span v-if="modelValue >= 0.5" class="font-bold">
    - More random, creative, and risky</span
  >
  <span v-else class="font-bold"> - More focused, deterministic, and safe</span>
</template>
