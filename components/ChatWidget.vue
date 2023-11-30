<script setup lang="ts">
import type { OpenAI } from "openai";
import type { Message, User } from "~~/types";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});

const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Botman",
});

const users = computed(() => [me.value, bot.value]);

const messages = ref<Message[]>([]);

const usersTyping = ref<User[]>([]);

const messagesForApi = computed(() => {
  return messages.value.map((message) => ({
    role: message.userId,
    content: message.text,
  }));
});

async function handleNewMessage(message: Message) {
  messages.value.push(message);
  usersTyping.value.push(bot.value);

  try {
    const response: OpenAI.ChatCompletion = await $fetch("/api/ai", {
      method: "POST",
      body: {
        messages: messagesForApi.value,
      },
    });

    if (!response?.choices[0]?.message?.content) return;

    const botMessage = {
      id: response.id,
      userId: bot.value.id,
      createdAt: new Date(),
      text: response.choices[0].message.content,
    };

    messages.value.push(botMessage);
    usersTyping.value = [];
  } catch (error) {
    console.error("Error handling new message:", error);
  }
}
</script>

<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="messages"
    :usersTyping="usersTyping"
    @new-message="handleNewMessage"
  />
</template>
