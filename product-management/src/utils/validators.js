export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required'
  }
  return ''
}

export const validateNumber = (value, min = null, max = null) => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required'
  }
  
  const num = Number(value)
  
  if (isNaN(num)) {
    return 'Must be a valid number'
  }
  
  if (min !== null && num < min) {
    return `Must be at least ${min}`
  }
  
  if (max !== null && num > max) {
    return `Must be at most ${max}`
  }
  
  return ''
}

export const validatePrice = (value) => {
  const error = validateNumber(value, 0)
  if (error) return error
  
  const num = Number(value)
  if (num <= 0) {
    return 'Price must be greater than 0'
  }
  
  return ''
}

export const validateStock = (value) => {
  const error = validateNumber(value, 0)
  if (error) return error
  
  const num = Number(value)
  if (num < 0) {
    return 'Stock cannot be negative'
  }
  
  return ''
}

export const validateMinStock = (value, currentStock = null) => {
  const error = validateNumber(value, 0)
  if (error) return error
  
  const num = Number(value)
  if (num < 0) {
    return 'Minimum stock cannot be negative'
  }
  
  // Optional: validate that minStock is not greater than current stock (if provided)
  if (currentStock !== null && num > currentStock) {
    return 'Minimum stock cannot be greater than current stock'
  }
  
  return ''
}

export const validateProductForm = (formData) => {
  const errors = {}
  let isValid = true

  // Validate name
  const nameError = validateRequired(formData.name)
  if (nameError) {
    errors.name = nameError
    isValid = false
  }

  // Validate price
  const priceError = validatePrice(formData.price)
  if (priceError) {
    errors.price = priceError
    isValid = false
  }

  // Validate stock
  const stockError = validateStock(formData.stock)
  if (stockError) {
    errors.stock = stockError
    isValid = false
  }

  // Validate minStock
  if (formData.minStock !== undefined && formData.minStock !== null && formData.minStock !== '') {
    const minStockError = validateMinStock(formData.minStock, formData.stock)
    if (minStockError) {
      errors.minStock = minStockError
      isValid = false
    }
  }

  // Validate category
  const categoryError = validateRequired(formData.category)
  if (categoryError) {
    errors.category = categoryError
    isValid = false
  }

  return {
    isValid,
    errors
  }
}
