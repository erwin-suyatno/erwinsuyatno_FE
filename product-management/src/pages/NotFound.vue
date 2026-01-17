<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Page Not Found</h1>
      <p class="error-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="error-actions">
        <AppButton @click="goHome">
          🏠 Go to Home
        </AppButton>
        <AppButton variant="outline" @click="goBack">
          ← Go Back
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()

const goHome = () => {
  router.push('/products')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--color-gray-50);
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  padding: 60px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-red), var(--color-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 24px;
  animation: fadeIn 0.6s ease;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 16px 0;
  animation: fadeIn 0.6s ease 0.2s both;
}

.error-message {
  font-size: 16px;
  color: var(--color-gray-600);
  margin: 0 0 32px 0;
  line-height: 1.6;
  animation: fadeIn 0.6s ease 0.4s both;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeIn 0.6s ease 0.6s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 24px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-message {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .error-actions .app-button {
    width: 100%;
  }
}
</style>
