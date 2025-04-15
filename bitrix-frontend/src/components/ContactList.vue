<template>
  <div class="table-container">
    <table class="contact-table">
      <thead>
        <tr>
          <th>Tên</th>
          <th>Địa chỉ</th>
          <th>Điện thoại</th>
          <th>Email</th>
          <th>Website</th>
          <th>Tên ngân hàng</th>
          <th>Số tài khoản</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="contact in contacts" :key="contact.ID">
          <td>{{ contact.NAME }}</td>
          <td>{{ contact.ADDRESS }}</td>
          <td>{{ contact.PHONE }}</td>
          <td>{{ contact.EMAIL }}</td>
          <td>{{ contact.WEBSITE }}</td>
          <td>{{ contact.BANK_NAME }}</td>
          <td>{{ contact.ACCOUNT_NAME }}</td>
          <td>
            <button class="btn edit" @click="editContact(contact)">Sửa</button>
            <button class="btn delete" @click="deleteContact(contact.ID)">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Sửa -->
    <div v-if="editingContact" class="modal-overlay">
      <div class="modal">
        <h3>Chỉnh Sửa Thông Tin</h3>
        <form @submit.prevent="updateContact">
          <input v-model="editingContact.NAME" placeholder="Tên" required />
          <input v-model="editingContact.ADDRESS" placeholder="Địa chỉ" />
          <input v-model="editingContact.PHONE" placeholder="Điện thoại" />
          <input v-model="editingContact.EMAIL" placeholder="Email" />
          <input v-model="editingContact.WEBSITE" placeholder="Website" />
          <input
            v-model="editingContact.BANK_NAME"
            placeholder="Tên ngân hàng"
          />
          <input
            v-model="editingContact.ACCOUNT_NAME"
            placeholder="Số tài khoản"
          />

          <div class="modal-actions">
            <button type="submit" class="btn save">Lưu</button>
            <button
              type="button"
              class="btn cancel"
              @click="editingContact = null"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["contacts"]);
const emit = defineEmits(["updated", "deleted"]);

const editingContact = ref(null);

function editContact(contact) {
  editingContact.value = { ...contact }; // Tạo bản sao để chỉnh sửa
}

function updateContact() {
  fetch(`http://localhost:3000/api/contact/${editingContact.value.ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editingContact.value),
  }).then(() => {
    editingContact.value = null;
    emit("updated");
  });
}

function deleteContact(id) {
  if (confirm("Bạn có chắc muốn xóa?")) {
    fetch(`http://localhost:3000/api/contact/${id}`, {
      method: "DELETE",
    }).then(() => emit("deleted"));
  }
}
</script>

<style scoped>
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 20px;
}

.table-container::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.contact-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: Arial, sans-serif;
  background-color: #fff;
  min-width: 1000px;
}

.contact-table th,
.contact-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

.contact-table thead {
  background-color: #007bff;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 1;
}

.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.btn.edit {
  background-color: #ffc107;
  color: #000;
}

.btn.delete {
  background-color: #dc3545;
  color: #fff;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
}

.modal input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn.save {
  background-color: #28a745;
  color: white;
}

.btn.cancel {
  background-color: #6c757d;
  color: white;
}
</style>
