<template>
  <div class="app-input-wrapper">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :class="['app-input', { 'has-error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number],
    default: ''
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

defineEmits(['update:modelValue', 'blur'])
</script>

<style scoped>
.app-input-wrapper {
  width: 100%;
}

.app-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  background: white;
}

.app-input:focus {
  outline: none;
  border-color: var(--color-primary-red);
}

.app-input.has-error {
  border-color: var(--color-error);
}

.app-input::placeholder {
  color: var(--color-gray-400);
}
</style>
