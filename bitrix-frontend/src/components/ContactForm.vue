<template>
  <form @submit.prevent="submitForm" class="form-container">
    <h2>Thông tin liên hệ</h2>

    <div class="form-grid">
      <div class="form-group">
        <label for="name">Tên <span class="required">*</span></label>
        <input id="name" v-model="form.NAME" required placeholder="Nhập tên" />
      </div>

      <div class="form-group">
        <label for="address">Địa chỉ</label>
        <input id="address" v-model="form.ADDRESS" placeholder="Nhập địa chỉ" />
      </div>

      <div class="form-group">
        <label for="phone">Số điện thoại</label>
        <input
          id="phone"
          v-model="form.PHONE"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="form.EMAIL"
          placeholder="Nhập email"
        />
      </div>

      <div class="form-group">
        <label for="website">Website</label>
        <input
          id="website"
          type="url"
          v-model="form.WEBSITE"
          placeholder="Nhập website"
        />
      </div>

      <div class="form-group">
        <label for="bank">Tên ngân hàng</label>
        <input
          id="bank"
          v-model="form.BANK_NAME"
          placeholder="Nhập tên ngân hàng"
        />
      </div>

      <div class="form-group">
        <label for="account">Số tài khoản</label>
        <input
          id="account"
          v-model="form.ACCOUNT_NAME"
          placeholder="Nhập số tài khoản"
        />
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="submit-btn">💾 Lưu thông tin</button>

      <input
        v-model="searchName"
        placeholder="Tìm kiếm theo tên"
        class="search-input"
      />
      <button type="button" class="search-btn" @click="searchContact">
        🔍 Tìm kiếm
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from "vue";
const emit = defineEmits(["saved", "searched"]);

const form = reactive({
  NAME: "",
  ADDRESS: "",
  PHONE: "",
  EMAIL: "",
  WEBSITE: "",
  BANK_NAME: "",
  ACCOUNT_NAME: "",
});

const searchName = ref("");

async function submitForm() {
  await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  emit("saved");
  Object.keys(form).forEach((k) => (form[k] = ""));
}

async function searchContact() {
  let url = "http://localhost:3000/api/contact";
  if (searchName.value.trim()) {
    url += `?name=${encodeURIComponent(searchName.value.trim())}`;
  }
  const res = await fetch(url);
  const result = await res.json();
  emit("searched", result);
}
</script>

<style scoped>
.form-container {
  max-width: 700px;
  text-align: left;
}

h2 {
  margin-bottom: 1rem;
}

.required {
  color: red;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.submit-btn,
.search-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-btn {
  background-color: #28a745;
}

.search-btn:hover {
  background-color: #218838;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.search-input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  flex: 1;
  min-width: 200px;
}
</style>
