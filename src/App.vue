<template>
  <div id="app">
    <div class="container">
      <Editor
        ref="titleEditor"
        v-model="settings.documentTitle"
        :value-options="valueOptions"
        class="el-textarea__inner el-textarea__inner--wrapped"
      />

      <TagCloud
        :tags="valueOptions"
        @tag-selected="onTagSelected('titleEditor', $event)"
      />

      <Editor
        ref="editor"
        v-model="settings.documentBody"
        :value-options="valueOptions"
        class="el-textarea__inner el-textarea__inner--wrapped"
      />

      <TagCloud
        :tags="valueOptions"
        @tag-selected="onTagSelected('editor', $event)"
      />
    </div>
  </div>
</template>

<script>
import TagCloud from './components/TagCloud.vue';
import Editor from './components/Editor.vue';

export default {
  name: 'App',
  components: {
    TagCloud,
    Editor
  },
  data: () => ({
    settings: {
      documentBody: "Dobrý den,\n\nV příloze tohoto e-mailu naleznete novou fakturu č. %{number} v hodnotě %{total}.\nJejí splatnost je za %{due_in}, tedy do %{due_on}.\n\nJako forma úhrady byl zvolen bankovní převod, všechny důležité údaje k platbě naleznete níže:\n\n%{payment_data}\n\nV případě dotazů mě neváhejte kontaktovat.\n\nS pozdravem,\n\nTonda Pleskac\n",
      documentTitle: `Nová faktura č. %{number} se splatností %{due_on}.`
    },
    valueOptions: [
      {
        key: 'number',
        value: 'číslo faktury',
        preview: '20230001'
      },
      {
        key: 'due_in',
        value: 'splatnost',
        preview: '14 dní'
      },
      {
        key: 'due_on',
        value: 'splatnost dne',
        preview: '21. 12. 2023'
      },
      {
        key: 'payment_data',
        value: 'platební údaje',
        preview: `Příjemce: Antonín Pleskač\nČíslo účtu: 1648869133/0800\nIBAN: CZ45 2010 0000 0026 0020 7469\nSWIFT: FIOBCZPP\nVariabilní symbol: 202200019\nKonstantní symbol: 0308`
      },
      {
        key: 'total',
        value: 'celkem',
        preview: '5 000 Kč'
      },
    ],
    savedSelection: null
  }),
  methods: {
    onTagSelected(element, tag) {
      this.$refs[element].insertTag(tag.key);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.el-textarea__inner--wrapped {
  white-space: pre-wrap;
}
.preview {
  white-space: pre-wrap;
  margin: 20px;
}

.container {
    max-width: 79.33333rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 2.66667rem;
    padding-right: 2.66667rem;
}
</style>
