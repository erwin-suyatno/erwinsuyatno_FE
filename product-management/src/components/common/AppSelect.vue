<template>
  <div class="app-select-wrapper">
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      :class="['app-select', { 'has-error': error }]"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-select-wrapper {
  width: 100%;
}

.app-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: white;
  cursor: pointer;
}

.app-select:focus {
  outline: none;
  border-color: var(--color-primary-red);
}

.app-select.has-error {
  border-color: var(--color-error);
}
</style>
