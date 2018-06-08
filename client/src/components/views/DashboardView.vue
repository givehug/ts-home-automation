<template>
<div
	id="dashboard"
	class="main-content"
>
    <div class="tile is-ancestor">
    <div class="tile is-vertical">
        <div class="tile">
        <div class="tile is-8-desktop is-vertical">
            <div class="tile">
            <div class="tile is-parent">
                <div class="tile is-child box">
                    <p class="title">Users</p>
                    <user-list></user-list>
                </div>
            </div>
            <div class="tile is-parent">
                <article class="tile is-child box">
                    <p class="title">LED</p>
                    <led-unit></led-unit>
                </article>
            </div>
            </div>
            <div class="tile is-parent">
            <article class="tile is-child box">
                <p class="title">Security</p>
                <security-unit></security-unit>
            </article>
            </div>
        </div>
        <div class="tile is-parent is-hidden-touch">
            <article class="tile is-child">
                <robo-unit></robo-unit>
            </article>
        </div>
        </div>
        <div class="tile">
        <div class="tile is-8-desktop is-parent">
            <article class="tile is-child box">
            <p class="title">Nerwork</p>
            <network-unit></network-unit>
            </article>
        </div>
            <!-- <div class="tile is-parent">
                <article class="tile is-child box">
                <p class="title">Ten</p>
                <p class="subtitle">Subtitle</p>
                <div class="content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                </div>
                </article>
            </div> -->
        </div>
    </div>
    </div>

    <!-- <div class="tile is-ancestor">
    <div class="tile is-parent">
        <article class="tile is-child box">
        <p class="title">Twelve</p>
        <p class="subtitle">Subtitle</p>
        <div class="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut.</p>
        </div>
        </article>
    </div>
    <div class="tile is-parent is-6">
        <article class="tile is-child box">
        <p class="title">Thirteen</p>
        <p class="subtitle">Subtitle</p>
        <div class="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
        </div>
        </article>
    </div>
    <div class="tile is-parent">
        <article class="tile is-child box">
        <p class="title">Fourteen</p>
        <p class="subtitle">Subtitle</p>
        <div class="content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut.</p>
        </div>
        </article>
    </div>
    </div> -->
</div>
</template>

<script>
import LedUnit from '@/components/units/LedUnit.vue';
import NetworkUnit from '@/components/units/NetworkUnit.vue';
import RoboUnit from '@/components/units/RoboUnit.vue';
import SecurityUnit from '@/components/units/SecurityUnit.vue';
import UserList from '@/components/units/UserList.vue';

export default {
  name: 'DashboardView',
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
      margin-bottom: 15px;
      font-size: 20px;
      text-transform: uppercase;
    }
  }
  .box {
    .button {
      margin: 5px;
    }
  }
}
</style>