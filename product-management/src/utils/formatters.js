export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0'
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format large numbers with compact notation while preserving full value
 * @param {number} amount - The amount to format
 * @param {boolean} showFull - If true, returns full formatted number
 * @returns {Object} { display: string, full: string }
 */
export const formatLargeNumber = (amount, showFull = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return { display: '0', full: '0' }
  }
  
  const full = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
  
  // For very large numbers, create compact version
  let display = full
  if (!showFull && amount >= 1000000000) {
    // Billions
    const billions = (amount / 1000000000).toFixed(2)
    display = `${billions}B`.replace(/\.00$/, '')
  } else if (!showFull && amount >= 1000000) {
    // Millions
    const millions = (amount / 1000000).toFixed(2)
    display = `${millions}M`.replace(/\.00$/, '')
  } else if (!showFull && amount >= 1000) {
    // Thousands
    const thousands = (amount / 1000).toFixed(1)
    display = `${thousands}K`.replace(/\.0$/, '')
  }
  
  return { display, full }
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  return date.toLocaleDateString('id-ID', options)
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return date.toLocaleDateString('id-ID', options)
}
