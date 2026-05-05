<template>
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f4f7f8;
  color: #17202a;
  font-family: Arial, sans-serif;
}

button,
input,
select {
  font: inherit;
}

button {
  border: 0;
  border-radius: 6px;
  background: #166a5f;
  color: #ffffff;
  cursor: pointer;
  font-weight: 700;
  min-height: 44px;
  padding: 0 18px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.secondary {
  background: #dce7e5;
  color: #163b36;
}

.page {
  margin: 0 auto;
  max-width: 980px;
  padding: 40px 20px;
}

.narrow-page {
  max-width: 460px;
}

.page-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.panel {
  background: #ffffff;
  border: 1px solid #dce5e7;
  border-radius: 8px;
  padding: 24px;
}

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-stack,
.action-form {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

.field span,
.label {
  color: #5a6c73;
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}

input,
select {
  border: 1px solid #b9c8cc;
  border-radius: 6px;
  min-height: 44px;
  padding: 0 12px;
  width: 100%;
}

h1,
h2 {
  margin: 4px 0 0;
}

.details {
  display: grid;
  gap: 12px;
  margin: 20px 0 0;
}

.details div {
  display: flex;
  justify-content: space-between;
}

.details dt {
  color: #5a6c73;
}

.details dd {
  margin: 0;
}

.button-row {
  display: flex;
  gap: 12px;
}

.error {
  color: #b42318;
  font-weight: 700;
  margin: 0;
}

@media (max-width: 720px) {
  .grid,
  .page-header {
    display: grid;
  }

  .page-header {
    gap: 16px;
  }
}
</style>
