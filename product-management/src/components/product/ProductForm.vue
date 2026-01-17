<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <div class="form-group">
      <label for="name" class="form-label">
        Product Name <span class="required">*</span>
      </label>
      <AppInput
        id="name"
        v-model="formData.name"
        placeholder="Enter product name"
        :error="errors.name"
        required
      />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="description" class="form-label">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-textarea"
        placeholder="Enter product description"
        rows="4"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="price" class="form-label">
          Price <span class="required">*</span>
        </label>
        <AppInput
          id="price"
          v-model.number="formData.price"
          type="number"
          placeholder="0"
          :error="errors.price"
          required
        />
        <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
      </div>

      <div class="form-group">
        <label for="stock" class="form-label">
          Stock <span class="required">*</span>
        </label>
        <AppInput
          id="stock"
          v-model.number="formData.stock"
          type="number"
          placeholder="0"
          :error="errors.stock"
          required
        />
        <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
      </div>
    </div>

    <div class="form-group">
      <label for="minStock" class="form-label">
        Minimum Stock
        <span class="label-hint">(Alert when stock falls below this value)</span>
      </label>
      <AppInput
        id="minStock"
        v-model.number="formData.minStock"
        type="number"
        placeholder="10"
        :error="errors.minStock"
      />
      <span v-if="errors.minStock" class="error-message">{{ errors.minStock }}</span>
      <span v-if="!errors.minStock && formData.minStock !== null && formData.minStock !== ''" class="form-hint">
        Product will be marked as low stock when quantity falls below {{ formData.minStock }}
      </span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="category" class="form-label">
          Category <span class="required">*</span>
        </label>
        <AppSelect
          id="category"
          v-model="formData.category"
          :options="categories"
          :error="errors.category"
          placeholder="Select category"
          required
        />
        <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
      </div>

      <div class="form-group">
        <label for="sku" class="form-label">SKU</label>
        <AppInput
          id="sku"
          v-model="formData.sku"
          placeholder="Optional SKU"
        />
      </div>
    </div>

    <div class="form-actions">
      <AppButton type="button" variant="outline" @click="$emit('cancel')">
        Cancel
      </AppButton>
      <AppButton type="submit" :loading="isSubmitting">
        {{ isEditMode ? 'Update Product' : 'Create Product' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { validateProductForm } from '@/utils/validators'
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppButton from '@/components/common/AppButton.vue'

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = !!props.product
const isSubmitting = ref(false)

const categories = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Software', label: 'Software' },
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Other', label: 'Other' }
]

const formData = reactive({
  name: props.product?.name || '',
  description: props.product?.description || '',
  price: props.product?.price || 0,
  stock: props.product?.stock || 0,
  minStock: props.product?.minStock ?? 10,
  category: props.product?.category || '',
  sku: props.product?.sku || ''
})

const errors = reactive({
  name: '',
  price: '',
  stock: '',
  minStock: '',
  category: ''
})

// Watch for product changes (when editing)
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    Object.assign(formData, {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      stock: newProduct.stock,
      minStock: newProduct.minStock ?? 10,
      category: newProduct.category,
      sku: newProduct.sku || ''
    })
  }
}, { immediate: true })

const handleSubmit = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  // Validate
  const validation = validateProductForm(formData)
  
  if (!validation.isValid) {
    Object.assign(errors, validation.errors)
    return
  }

  isSubmitting.value = true
  
  // Emit submit event
  emit('submit', { ...formData })
  
  // Reset submitting after a delay (parent will handle actual submission)
  setTimeout(() => {
    isSubmitting.value = false
  }, 500)
}
</script>

<style scoped>
.product-form {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-gray-700);
  font-size: 14px;
}

.required {
  color: var(--color-error);
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-red);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.error-message {
  display: block;
  margin-top: 4px;
  color: var(--color-error);
  font-size: 12px;
}

.label-hint {
  font-weight: 400;
  color: var(--color-gray-500);
  font-size: 12px;
  margin-left: 4px;
}

.form-hint {
  display: block;
  margin-top: 4px;
  color: var(--color-gray-500);
  font-size: 12px;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-gray-200);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
