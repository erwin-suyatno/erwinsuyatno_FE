<template>
  <div class="stat-card" :class="{ 'alert': alert }">
    <div class="stat-icon" :style="{ backgroundColor: iconBgColor }">
      <AppIcon :name="icon" size="large" />
    </div>
    <div class="stat-content">
      <h3 class="stat-title">{{ title }}</h3>
      <p 
        ref="valueElement"
        class="stat-value" 
        :class="`value-${color}`"
        :title="fullValue"
        :data-full-value="fullValue"
      >
        <span class="value-text" :title="fullValue">{{ displayValue }}</span>
      </p>
      <div v-if="trend" class="stat-trend" :class="trend.type">
        <AppIcon :name="trend.type === 'up' ? 'arrow-up' : 'arrow-down'" size="small" />
        <span>{{ trend.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'orange', 'red', 'purple'].includes(value)
  },
  trend: {
    type: Object,
    default: null
  },
  alert: {
    type: Boolean,
    default: false
  }
})

const valueElement = ref(null)

// Full value as string (for tooltip and comparison)
const fullValue = computed(() => {
  return String(props.value)
})

// Display value - always show full value, CSS will handle truncation
const displayValue = computed(() => {
  return fullValue.value
})

const iconBgColor = computed(() => {
  const colors = {
    blue: 'rgba(59, 130, 246, 0.1)',
    green: 'rgba(16, 185, 129, 0.1)',
    orange: 'rgba(249, 115, 22, 0.1)',
    red: 'rgba(220, 38, 38, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)'
  }
  return colors[props.color] || colors.blue
})
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  border: 1px solid var(--color-gray-200);
}

.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.stat-card.alert {
  border-color: var(--color-error);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, white 100%);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon :deep(svg) {
  color: var(--color-gray-700);
  width: 20px;
  height: 20px;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}

.stat-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.3;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  position: relative;
  cursor: help;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

/* For very long numbers, use ellipsis to prevent overflow */
.stat-value .value-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: baseline;
}

/* Tooltip for full value - always show on hover to ensure user can see complete value */
.stat-value[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 14px;
  background: var(--color-gray-900);
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  word-break: keep-all;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.stat-value[title]:hover::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-gray-900);
  z-index: 1001;
  pointer-events: none;
}

/* Responsive font size for very long values */
@media (max-width: 768px) {
  .stat-value {
    font-size: 18px;
  }
  
  .stat-value .value-text {
    font-size: 16px;
  }
}

/* Dynamic font size adjustment for extremely long values */
.stat-value .value-text {
  /* If text is longer than ~15 characters, reduce font size slightly */
  font-size: inherit;
}

/* For currency values that might be very long, ensure proper handling */
.stat-card {
  min-width: 0;
  width: 100%;
}

.value-blue {
  color: #3b82f6;
}

.value-green {
  color: #10b981;
}

.value-orange {
  color: var(--color-orange);
}

.value-red {
  color: var(--color-error);
}

.value-purple {
  color: #8b5cf6;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.up {
  color: #10b981;
}

.stat-trend.down {
  color: var(--color-error);
}

@media (max-width: 768px) {
  .stat-card {
    padding: 12px;
    gap: 10px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-icon :deep(svg) {
    width: 18px;
    height: 18px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-title {
    font-size: 11px;
  }
}
</style>
