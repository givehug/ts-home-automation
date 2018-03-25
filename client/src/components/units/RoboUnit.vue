<template>
<div id="robo">
    <div class="robo-face">
        <div class="head">
            <div class="antena">
                <div class="antena__body">
                    <div class="antena__bulb"></div>
                </div>
            </div>
            <div
				class="face"
				v-bind:class="emotions"
			>
                <div class="eye eye--left">
                    <div class="eye__body">
                        <div class="eye__ball"></div>
                    </div>
                </div>
                <div class="eye eye--right">
                    <div class="eye__body">
                        <div class="eye__ball"></div>
                    </div>
                </div>
                <div class="jaw jaw--upper">
                    <div
						v-for="n in 5"
						:key="n"
						class="tooth"
					></div>
                </div>
                <div class="jaw jaw--lower">
                    <div
						v-for="n in 5"
						:key="n"
						class="tooth"
					></div>
                </div>
            </div>
        </div>
    </div>
    <div
		v-if="$store.state.app.dataLoaded"
		class="robo-settings"
	>
        <b-switch
			:value="$store.state.settings.data.annyangActive"
			@input="toggleActive()"
		>{{$store.state.settings.data.annyangActive ? 'Active' : 'Inactive'}}</b-switch>
    </div>
</div>
</template>

<script>
import {actions, getters} from '@/store/constants';

export default {
    name: 'RoboUnit',
    computed: {
        emotions() {
            return this.$store.getters[getters.ROBO_GET_EMOTIONS_STRING];
        }
    },
    methods: {
        toggleActive() {
            this.$store.dispatch(actions.ROBO_TOGGLE);
        }
    },
}
</script>

<style lang="scss" scoped>
.robo-face {
    .head {
        position: relative;
        width: 250px;
        height: 250px;
        margin: 100px auto 30px;
    }
    .face {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 5px solid black;
        border-radius: 5px;
        padding: 20px;
        box-sizing: border-box;
        background: #E8C95C;
        z-index: 15;
    }
    .antena {
        width: 5px;
        height: 150px;
        background: black;
        position: absolute;
        top: -75px;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 14;
        &__body {
            width: 100%;
            height: 100%;
            position: relative;
        }
        &__bulb {
            width: 20px;
            height: 20px;
            border-radius: 100%;
            background: black;
            position: absolute;
            top: -5px;
            left: -8px;
        }
    }
    .eye {
        position: absolute;
        top: 30px;
        transition: .1s;
        &--left {
            left: 30px;
        }
        &--right {
            right: 30px;
        }
        &__body {
            border-radius: 100%;
            background: white;
            border: 5px solid black;
            width: 50px;
            height: 50px;
            position: relative;
            overflow: hidden;
            transition: .1s;
        }
        &__ball {
            width: 20px;
            height: 20px;
            background: black;
            border-radius: 100%;
            position: absolute;
            top: 13px;
            left: 10px;
            transition: .1s;
        }
    }
    .jaw {
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 125px;
        border: 2.5px solid black;
        height: 2.5px;
        display: flex;
        flex-wrap: wrap;
        box-sizing: padding-box;
        overflow: hidden;
        transition: .1s;
        &--upper {
            bottom: 60px;
        }
        &--lower {
            top: 175px;
        }
    }
    .tooth {
        background: white;
        height: 100%;
        flex-grow: 1;
        border: 2.5px solid black;
        box-sizing: border-box;
    }
    // emotions
    .face {
        &.mouthOpen {
            .jaw {
                height: 25px
            }
        }
        &.talking {
            .jaw {
                animation: talking 0.7s infinite;
            }
        }
        &.eyesClosed {
            .eye {
                top: 55px;
            }
            .eye__body {
                height: 0;
            }
        }
        &.weird {
            .jaw {
                height: 35px;
            }
            .eye__ball {
                width: 30px;
                height: 30px;
                top: 10px;
                left: 10px;
            }
        }
        &.moveEyes {
            .eye__ball {
                animation: moveEyes 5s infinite;
            }
            .eye__body {
                animation: closeEyes 5s infinite;
            }
            .eye {
                animation: closeEyes1 5s infinite;
            }
        }
    }
}

@keyframes talking {
    0% {
        height: 2.5px;
    }
    20% {
        height: 2.5px;
    }
    50% {
        height: 25px;
    }
    80% {
        height: 2.5px;
    }
    100% {
        height: 2.5px;
    }
}

@keyframes moveEyes {
    0% {
        left: 5px;
    }
    30% {
        left: 5px;
    }
    35% {
        left: 25px;
    }
    55% {
        left: 25px;
    }
    60% {
        left: 5px;
    }
    100% {
        left: 5px;
    }
}

@keyframes closeEyes {
    88% {
        height: 50px;
    }
    90% {
        height: 0;
    }
    92% {
        height: 50px;
    }
}

@keyframes closeEyes1 {
    88% {
        top: 30px;
    }
    90% {
        top: 55px;
    }
    92% {
        top: 30px;
    }
}

.robo-settings {
    padding: 0 20px;
    opacity: 0;
    visibility: hidden;
    transition: .2s;
}

#robo {
    &:hover {
        .robo-settings {
            opacity: 1;
            visibility: visible;
        }
    }
}
</style>