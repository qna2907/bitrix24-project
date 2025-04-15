<template>
  <div class="container">
    <h2>Bitrix Quản Lý Liên Hệ</h2>
    <ContactForm @saved="loadContacts" @searched="contacts = $event" />
    <ContactList
      :contacts="contacts"
      @updated="loadContacts"
      @deleted="loadContacts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ContactForm from "./components/ContactForm.vue";
import ContactList from "./components/ContactList.vue";

const contacts = ref([]);

async function loadContacts() {
  const res = await fetch("http://localhost:3000/api/contact");
  contacts.value = await res.json();
}

onMounted(loadContacts);
</script>
