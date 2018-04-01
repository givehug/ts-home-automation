<template>
  <section class="hero is-grow is-flex is-primary is-grow">
    <div class="hero-body center-content">
      <div class="has-text-centered">
        <h1 class="title">JS Home Automation</h1>
        <p><router-link
          class="button"
          to="/login"
        >Sign in</router-link></p>
      </div>
    </div>
    <div class="hero-foot">
      <div class="has-text-centered">
        <p>
          <a href="https://github.com/givehug">Vladimir Boretskyi</a>. 
          <a href="https://github.com/givehug/JavaScript-Home-Automation">The source code</a> 
          is licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>
          . Content
          is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC ANS 4.0</a>.
        </p>
      </div>
    </div> 
  </section>
</template>

<script>
export default {name: 'WelcomeView'};
</script>

<style lang="scss" scoped>
.hero-foot {
    padding: 75px 24px 25px;
}
</style>