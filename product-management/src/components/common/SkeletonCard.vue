<template>
  <div class="skeleton-card">
    <div class="skeleton-header">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-badge"></div>
    </div>
    <div class="skeleton-line skeleton-description"></div>
    <div class="skeleton-line skeleton-description short"></div>
    <div class="skeleton-details">
      <div class="skeleton-detail-item">
        <div class="skeleton-line skeleton-label"></div>
        <div class="skeleton-line skeleton-value"></div>
      </div>
      <div class="skeleton-detail-item">
        <div class="skeleton-line skeleton-label"></div>
        <div class="skeleton-line skeleton-value"></div>
      </div>
    </div>
    <div class="skeleton-actions">
      <div class="skeleton-button"></div>
      <div class="skeleton-button"></div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  /* Match exact dimensions with ProductCard */
  min-height: 280px;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.skeleton-title {
  width: 60%;
  height: 20px;
  border-radius: 4px;
}

.skeleton-badge {
  width: 80px;
  height: 24px;
  border-radius: 12px;
}

.skeleton-description {
  width: 100%;
  height: 14px;
  margin-bottom: 8px;
  border-radius: 4px;
}

.skeleton-description.short {
  width: 70%;
}

.skeleton-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-gray-200);
}

.skeleton-detail-item {
  display: flex;
  justify-content: space-between;
}

.skeleton-label {
  width: 60px;
  height: 14px;
  border-radius: 4px;
}

.skeleton-value {
  width: 100px;
  height: 14px;
  border-radius: 4px;
}

.skeleton-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.skeleton-button {
  width: 80px;
  height: 36px;
  border-radius: 6px;
}

/* Subtle shimmer animation - best practice for mobile */
.skeleton-line,
.skeleton-badge,
.skeleton-button {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0%,
    var(--color-gray-200) 45%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 55%,
    var(--color-gray-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 2s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

/* Subtle pulse effect for entire card */
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

/* Shimmer animation - subtle and smooth */
@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Apply subtle pulse to entire card */
.skeleton-card {
  animation: skeleton-pulse 2.5s ease-in-out infinite;
}

@media (max-width: 768px) {
  .skeleton-card {
    padding: 16px;
    min-height: 260px;
  }
  
  .skeleton-actions {
    flex-direction: column;
  }
  
  .skeleton-button {
    width: 100%;
    height: 40px;
  }
}
</style>
