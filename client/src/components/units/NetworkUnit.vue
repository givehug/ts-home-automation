<template>
<div class="network">
    <div
		v-if="!showNetwork"
		class="showNetwork"
		@click="showNetwork = true"
	>show network</div>
    <div
		v-if="showNetwork"
		class="hideNetwork"
		@click="showNetwork = false"
	>hide</div>
    <div class="table-wrapper">
        <table v-if="showNetwork">
            <tr>
                <th>ip</th>
                <th>mac</th>
                <th>vendor</th>
            </tr>
            <tr
				v-for="mac in $store.state.home.network.macMap"
				:key="mac[1]"
			>
                <td>{{mac[0]}}</td>
                <td>{{mac[1]}}</td>
                <td>{{mac[2]}}</td>
            </tr>
        </table>
    </div>
</div>
</template>

<script>
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export default {
  name: 'NetworkUnit',
  data() {
    return {
      showNetwork: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.network {
    position: relative;

    .showNetwork,
    .hideNetwork {
        font-style: italic;
        opacity: 0.5;
        padding: 20px 0 40px;
        font-size: 1.2rem;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        cursor: pointer;
    }

    .hideNetwork {
        padding: 0;
        position: absolute;
        top: -53px;
        right: 20px;
    }

    tr {
        td, th {
            padding: 0 15px 15px;
        }
        th {
            text-align: center;
        }
    }

}
</style>