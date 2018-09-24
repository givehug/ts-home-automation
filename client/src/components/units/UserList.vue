<template>
<div>
  <!-- USERS LIST -->
  <ul
    v-if="$store.state.app.dataLoaded"
    class="userList"
  >
    <li
      class="userList-item"
      v-for="user in $store.state.users.map"
      :key="user._id"
    >
      <b-tooltip
        :label="isUserAtHome(user._id) ? 'At Home' : 'Away'"
        position="is-right" type="is-dark"
      >
        <i
          class="userList-status"
          :class="{'active': isUserAtHome(user._id)}"
        ></i>
        <span class="userList-name">{{user.name}}</span>
      </b-tooltip>
      <div class="userList-info">
        <span class="userList-email">{{user.email}}</span>
        <span
          class="icon has-text-danger userList-del"
          v-if="amIAdmin && !user.admin"
          @click="deleteUser(user._id)"
        >
          <i class="fa fa-trash-o"></i>
        </span>
      </div>
    </li>
  </ul>
  <!-- INVITE NEW USER -->
  <div
    v-if="amIAdmin"
    class="userList-invite"
  >
    <button
      v-if="!showInviteFields"
      class="button"
      @click="showInviteFields = true"
    >Invite new</button>
    <div v-else>
      <b-field>
        <b-input
          placeholder="Name"
          type="text"
          v-model="newUserName">
        </b-input>
      </b-field>
      <b-field>
        <b-input
          placeholder="Email"
          type="email"
          v-model="newUserEmail">
        </b-input>
      </b-field>
      <b-field>
        <p class="control">
          <button
            :disabled="!newUserEmail"
            class="button is-primary"
            @click="inviteNewUser()"
          >Invite</button>
        </p>
        <p
          class="control"
          v-if="showInviteFields"
        >
          <button
            class="button is-danger"
            @mousedown="hide($event)"
          >X</button>
        </p>
      </b-field>
    </div>
  </div>
</div>
</template>

<script>
import { actions, getters } from "@/store/types";

export default {
  name: "UserList",
  data() {
    return {
      newUserEmail: "",
      newUserName: "",
      showInviteFields: false
    };
  },
  computed: {
    amIAdmin() {
      return this.$store.getters[getters.IS_ADMIN];
    }
  },
  methods: {
    hide(e) {
      e.preventDefault();
      e.stopPropagation();
      this.newUserEmail = "";
      this.newUserName = "";
      this.showInviteFields = false;
    },
    isUserAtHome(userId) {
      return this.$store.getters[getters.IS_USER_HOME](userId);
    },
    deleteUser(userId) {
      this.$dialog.confirm({
        title: "Delete user",
        message: "Are you sure you want to delete this user?",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          try {
            const deleted = await this.$store.dispatch(
              actions.USERS_DELETE,
              userId
            );

            if (deleted) {
              this.$toast.open({
                message: `User deleted`,
                type: "is-success"
              });
            } else {
              this.$toast.open({
                message: "Error deleting user",
                type: "is-danger"
              });
            }
          } catch (error) {
            // do nothing
          }
        }
      });
    },
    async inviteNewUser() {
      const invited = await this.$store.dispatch(actions.USERS_INVITE, {
        name: this.newUserName,
        email: this.newUserEmail
      });

      if (invited) {
        this.newUserEmail = "";
        this.newUserName = "";
        this.$toast.open({
          message: `User invited`,
          type: "is-success"
        });
        this.showInviteFields = false;
      } else {
        this.$toast.open({
          message: `Error inviting user`,
          type: "is-danger"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.userList {
  max-height: 350px;
  overflow-y: auto;
  &-status {
    display: inline-block;
    width: 13px;
    height: 31px;
    margin-right: 30px;
    background: #ff3860;
    &.active {
      background: #23d160;
    }
  }
  &-name {
    font-weight: bold;
    margin-right: 20px;
  }
  &-email {
    display: inline-block;
    vertical-align: top;
    font-style: italic;
    font-size: 16px;
    opacity: 0.5;
    margin-right: 20px;
    top: 4px;
    position: relative;
  }
  &-del {
    display: inline-block;
    vertical-align: top;
    opacity: 0.5;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
  &-info {
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }
  &-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    overflow: hidden;
    margin-bottom: 15px;
    font-size: 1.3rem;
    font-weight: normal;
    .tooltip:not([data-label=""]):hover:after {
      font-size: 1rem;
    }
    @media screen and (max-width: 1023px) {
      &:hover {
        .userList-info {
          display: block;
          width: 100%;
        }
      }
    }
  }
  &-invite {
    input {
      display: block;
      width: 100%;
    }
  }
}
</style>