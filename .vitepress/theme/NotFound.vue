<template>
  <div class="not-found">
    <div class="not-found-code">404</div>
    <div class="not-found-emoji">🤖</div>
    <h1 class="not-found-title">页面不存在</h1>
    <p class="not-found-desc">这个页面可能已被移除，或者你输入了一个错误的地址。</p>
    <a href="/" class="not-found-btn">返回首页</a>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--vp-nav-height));
  text-align: center;
  padding: 0 24px;
}

.not-found-code {
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #d97757, #e8916f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.not-found-emoji {
  font-size: 3rem;
  margin-bottom: 16px;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px;
}

.not-found-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
  max-width: 320px;
}

.not-found-btn {
  display: inline-block;
  padding: 10px 28px;
  border-radius: 8px;
  background-color: #d97757;
  color: #fff !important;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none !important;
  transition: background-color 0.2s, transform 0.2s;
}

.not-found-btn:hover {
  background-color: #c4623d;
  transform: translateY(-1px);
}
</style>
