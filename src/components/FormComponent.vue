<template>
  <div class="container">
    <h2
      v-if="
        (children && children.type === 'page') ||
          (children && children.type === 'section')
      "
      :class="children.type === 'section' ? 'section' : 'page'"
    >
      {{ children.title }}
      <button
        class="add-button"
        v-if="children.type === 'page' || children.type === 'section'"
        @click="isNewQuestionPopVisible = true"
      >
        Add new question
      </button>
      <button
        class="add-button"
        v-if="children.type === 'page' || children.type === 'section'"
        @click="isNewSectionPopVisible = true"
      >
        Add new section
      </button>
    </h2>

    <div class="question" v-if="children && children.type === 'question'">
      <p>
        {{ children.title }}
      </p>
      <div class="dropdown">
        <span @click="toggleDropDown">
          {{ newType.title || children.response_type || "Choose type" }}
        </span>
        <span class="arrow" @click="toggleDropDown"></span>
        <transition name="fade" mode="out-in">
          <ul class="dropdown-list" v-if="dropDownOpened">
            <li
              v-for="type in types"
              @click="chooseNewType(type, children)"
              :key="type.id"
            >
              {{ type.title }}
            </li>
          </ul>
        </transition>
      </div>
    </div>

    <div v-if="children && children.items" class="inner_container">
      <FormComponent
        v-for="child in children.items"
        :children="child"
        :key="child.uuid"
      />
    </div>
    <AddNewItemPop
      v-if="isNewQuestionPopVisible"
      title="Add new question"
      @close="isNewQuestionPopVisible = false"
    >
      <template v-slot:body>
        <input
          type="text"
          placeholder="Question Title"
          v-model="questionTitleValue"
        />
        <div class="lower-block">
          You will be able to select correct response type in Form
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="confirmAdd-btn"
          :class="{ 'inactive-button': questionTitleValue.length === 0 }"
          @click="addQuestionInCorrectPlace(children)"
        >
          Confirm
        </button>
      </template>
    </AddNewItemPop>
    <AddNewItemPop
      v-if="isNewSectionPopVisible"
      title="Add new section"
      @close="isNewSectionPopVisible = false"
    >
      <template v-slot:body>
        <input
          type="text"
          placeholder="Section Title"
          v-model="sectionTitleValue"
        />
      </template>
      <template v-slot:footer>
        <button
          class="confirmAdd-btn"
          @click="addSectionInCorrectPlace(children)"
        >
          Confirm
        </button>
      </template>
    </AddNewItemPop>
  </div>
</template>

<script>
import AddNewItemPop from "./BasicPopUp";
const uuidv1 = require("uuid/v1");

export default {
  name: "FormComponent",
  props: ["children"],
  components: { AddNewItemPop },
  data() {
    return {
      title: "test",
      newType: false,
      dropDownOpened: false,
      isNewQuestionPopVisible: false,
      isNewSectionPopVisible: false,
      types: [{ title: "text", id: 1 }, { title: "number", id: 2 }],
      questionTitleValue: "",
      sectionTitleValue: "",
      newQuestionType: false
    };
  },
  computed: {
    getFormData() {
      return this.$store.getters.getActualFormData;
    }
  },
  methods: {
    chooseNewType(type, children) {
      this.newType = type;
      this.dropDownOpened = false;
      this.setNewFieldValue(children.uuid, this.getFormData.items, type);
    },
    toggleDropDown() {
      this.dropDownOpened = !this.dropDownOpened;
    },
    setNewFieldValue(value, node, newType) {
      if (Array.isArray(node))
        node.forEach(item => {
          if (item.uuid !== value) {
            if (item.items) {
              this.setNewFieldValue(value, item.items, newType);
            }
          } else {
            item.response_type = newType.title;
          }
        });
    },
    addQuestionInCorrectPlace(element) {
      if (this.questionTitleValue) {
        const data = {
          uuid: uuidv1(),
          title: this.questionTitleValue,
          response_type: "",
          type: "question"
        };
        element.items.push(data);
        this.isNewQuestionPopVisible = false;
      }
    },
    addSectionInCorrectPlace(element) {
      const data = {
        uuid: uuidv1(),
        title: this.sectionTitleValue,
        type: "section",
        items: []
      };
      element.items.push(data);
      this.isNewSectionPopVisible = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/common-styles.scss";
.question {
  border-bottom: 1px solid lightgray;
  padding: 16px 3px;
  font-size: 18px;
  color: gray;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}
.question p {
  margin: 0;
}
.container {
  margin-left: 50px;
}
.page {
  font-size: 32px;
}
.inner_container {
  background-color: #ffffff;
  border-radius: 5px;
}
.section {
  font-size: 24px;
  border-bottom: 1px solid lightgray;
}
.arrow {
  width: 9px;
  height: 9px;
  transform: rotate(45deg);
  position: absolute;
  right: 10px;
  border-bottom: 2px solid gray;
  border-right: 2px solid gray;
}
.dropdown {
  background: lightgray;
  position: relative;
  width: 200px;
  padding: 4px;
  border-radius: 3px;
  cursor: pointer;
}
.dropdown-list {
  position: absolute;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background: white;
  box-shadow: 3px 3px 5px gray;
  padding: 3px;
  list-style: none;
  border-radius: 0 3px 3px 0;
  z-index: 10;
  top: 10px;
}

.dropdown-list li {
  border-bottom: 1px solid lightgray;
}
.dropdown-list li:last-child {
  border: none;
}

.lower-block {
  display: flex;
  flex-flow: row nowrap;
  margin-top: 20px;
  justify-content: space-between;
  font-size: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.inactive-button {
  opacity: 0.3;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
