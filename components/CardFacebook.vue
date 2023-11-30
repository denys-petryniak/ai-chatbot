<script setup lang="ts">
const props = defineProps<{
  url: string;
  temperature: number;
}>();

const { chat, state, firstMessage } = useChatAi({ agent: "facebook" });
const announcement = computed(() => firstMessage.value?.content || undefined);

const generate = () => nextTick(() => chat(props));

defineExpose({ generate });

const postURL = computed(
  () =>
    `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`
);

const { copy } = useClipboard();
function post() {
  copy(announcement.value || "");
  setTimeout(() => window.open(postURL.value, "_blank"), 500);
}
</script>

<template>
  <CardGeneric title="Facebook" :state="state" :body="announcement">
    <button class="btn btn-neutral" @click="generate">Regenerate</button>
    <button class="btn btn-primary" target="_blank" @click.prevent="post">
      Copy Announcement and Post
    </button>
  </CardGeneric>
</template>
