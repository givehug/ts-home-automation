<template>
   <span
		:contenteditable="active"
		@input="update"
		@blur="blur"
	></span>
</template>

<script>
export default {
    name: 'EditableContentContent',
    props: {
        content: String,
        active: {
            type: Boolean,
            default: true,
		},
		trim: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this.$el.innerText = this.content;
    },
    methods:{
        update(event) {
            this.$emit('update', event.target.innerText);
		},
		blur(event) {
			// optionally trim value
			if (this.trim) {
				event.target.innerText = event.target.innerText.trim();
			}

			// fire blur only if value changed
			if (this.content === event.target.innerText) {
				return;
			}

            this.$emit('blur', event.target.innerText);
        },
    }
}
</script>

<style lang="scss" scoped>
[contenteditable] {
    display: inline-block;
    min-width: 30px;
    cursor: pointer;
    &:hover {
        outline: 1px dashed #ccc;
    }
    &:focus {
        outline: 1px solid #ccc;
    }
}
</style>