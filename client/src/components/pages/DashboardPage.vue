<template>
<div 
	id="dashboard"
	class="main-content"
>
    <div class="tile is-ancestor">
        <div class="tile is-7 is-vertical is-parent">
            <!-- users -->
            <div class="tile is-child box">
                <p class="title">Users</p>
                <user-list
					:hide-email="true"
					:hide-delete="true"
				></user-list>
            </div>
            <!-- home network -->
            <div class="tile is-child box">
                <p class="title">Nerwork</p>
                <network-unit></network-unit>
            </div>
        </div>
		<!-- robo -->
        <div class="tile is-parent is-vertical is-5">
            <div class="tile is-child">
                <robo-unit></robo-unit>
            </div>
        </div>
    </div>
	
    <div class="columns is-multiline">
		<!-- security -->
        <div class="column is-half-desktop">
            <div class="box">
                <p class="title">Security</p>
                <security-unit></security-unit>
            </div>
        </div>
		<!-- led -->
		<div class="column is-half-desktop">
            <div class="box">
                <p class="title">LED</p>
				<led-unit></led-unit>
            </div>
        </div>

    </div>
    <!-- <div class="tile is-ancestor">
        <div class="tile is-12 is-vertical is-parent">
            <div class="tile is-child box">
                <p class="title">other</p>
            </div>
        </div>
    </div> -->
</div>
</template>

<script>
import RoboUnit from '@/components/units/RoboUnit.vue';
import UserList from '@/components/units/UserList.vue';
import NetworkUnit from '@/components/units/NetworkUnit.vue';
import SecurityUnit from '@/components/units/SecurityUnit.vue';
import LedUnit from '@/components/units/LedUnit.vue';

export default {
    name: 'DashboardPage',
    components: {
        RoboUnit,
        UserList,
        NetworkUnit,
		SecurityUnit,
		LedUnit,
    },
};
</script>

<style lang="scss" scoped>
#dashboard {
    .tile {
        .title {
            margin-bottom: 30px;
        }
    }
    .box {
        .button {
            margin: 5px;
        }
    }
}
</style>