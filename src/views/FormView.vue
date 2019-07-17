<template>
  <div class="form-view">
    <div class="upper-container">
      <input
        type="file"
        accept="application/json"
        @change="assembleLocalFormData"
        class="upload-file-input"
      />
      <button
        @click="isNewPagePopVisible = true"
        class="add-button"
        v-if="fileAttached"
      >
        Add New Page
      </button>
      <button
        @click="downloadFile(getFormData, 'form')"
        class="download-button"
        v-if="fileAttached"
      >
        Download JSON
      </button>
    </div>

    <FormComponent
      v-for="item in getFormData.items"
      :children="item"
      :key="item.uuid"
    />

    <AddNewItemPop
      v-if="isNewPagePopVisible"
      title="Add new question"
      @close="isNewPagePopVisible = false"
    >
      <template v-slot:body>
        <input type="text" placeholder="Page Title" v-model="pageTitleValue" />
      </template>
      <template v-slot:footer>
        <button
          class="confirmAdd-btn"
          @click="addPageInCorrectPlace(getFormData)"
        >
          Confirm
        </button>
      </template>
    </AddNewItemPop>
  </div>
</template>

<script>
import FormComponent from "../components/FormComponent";
import AddNewItemPop from "../components/BasicPopUp";
const uuidv1 = require("uuid/v1");
export default {
  name: "FormView",
  components: {
    FormComponent,
    AddNewItemPop
  },
  computed: {
    getFormData() {
      return this.$store.getters.getActualFormData;
    }
  },
  data() {
    return {
      isNewPagePopVisible: false,
      pageTitleValue: "",
      fileAttached: false
    };
  },
  methods: {
    addPageInCorrectPlace(element) {
      const data = {
        uuid: uuidv1(),
        title: this.pageTitleValue,
        type: "page",
        items: []
      };
      element.items.push(data);
      this.isNewPagePopVisible = false;
    },
    assembleLocalFormData(event) {
      let file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.$store.dispatch("SET_FORMDATA", JSON.parse(e.target.result));
        this.fileAttached = true;
      };
      reader.readAsText(file);
    },
    downloadFile(data, fileName, type = "application/json") {
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(
        new Blob([JSON.stringify(data)], { type })
      );
      a.setAttribute("download", fileName);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }
  }
};
</script>

<style scoped lang="scss">
.upper-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
}
</style>
