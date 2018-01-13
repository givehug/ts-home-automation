<template>
<ul
	v-if="$store.state.users.list"
	class="userList"
>
    <li
		class="userList-item"
		v-for="user in $store.state.users.list"
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
        <span
			v-if="!hideEmail"
			class="userList-email"
		>{{user.email}}</span>
		<span
			class="icon is-medium has-text-danger userList-del"
			v-if="amIAdmin && !isUserAdmin(user._id) && !hideDelete"
			@click="deleteUser(user._id)"
		>
			<i class="fa fa-trash-o fa-lg"></i>
		</span>
    </li>
</ul>
</template>

<script>
import {actions, getters} from '@/store/constants';

export default {
    name: 'UserList',
	props: {
		hideEmail: Boolean,
		hideDelete: Boolean,
	},
	computed: {
		amIAdmin() {
			return this.$store.getters[getters.AM_I_ADMIN];
		}
	},
    methods: {
		isUserAdmin(userId) {
			return this.$store.getters[getters.IS_USER_ADMIN](userId);
		},
        isUserAtHome(userId) {
            return this.$store.getters[getters.IS_USER_HOME](userId);
		},
		deleteUser(userId) {
            this.$dialog.confirm({
                title: 'Delete user',
                message: 'Are you sure you want to delete this user?',
                confirmText: 'Delete',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: async() => {
					try {
						const deleted = await this.$store.dispatch(actions.USERS_DELETE, userId);

						if (deleted) {
							this.$toast.open({
								message: `User deleted`,
								type: 'is-success',
							});
						} else {
							this.$toast.open({
								message: 'Error deleting user',
								type: 'is-danger',
							});
						}
					} catch (error) {
						
					}
                },
            });
		},
    },
};
</script>

<style lang="scss" scoped>
.userList {
    max-height: 350px;
    overflow-y: auto;

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

        @media screen and (max-width: 600px) {
            flex-direction: column;
            margin-bottom: 25px;
        }
    }

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
        margin-right: 30px;
    }

    &-email {
        font-style: italic;
        opacity: 0.5;
		margin-right: 30px;
    }

	&-del {
        opacity: 0.5;
		cursor: pointer;

		&:hover {
			opacity: 1;
		}
    }

}
</style>