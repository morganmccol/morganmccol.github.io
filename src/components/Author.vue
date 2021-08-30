<template>
  <div class="author">
    <g-image alt="Author image" class="author__image" src="~/assets/images/icon.svg" width="180" height="180" blur="5" />

    <h1 v-if="showTitle" class="author__site-title">
      {{ $static.metadata.siteName }}
    </h1>

    <p class="author__intro">
      {{ $static.metadata.siteDescription }}
    </p>

    <p class="author__links">
      <a href="https://linkedin.com/in/morganmccol" target="_blank" rel="noopener noreferrer">
        <g-image alt="LinkedIn" class="author__social" src="~/assets/images/social/linkedin.svg" width="24" height="24" />
      </a>
      <a href="https://twitter.com/morganmccol" target="_blank" rel="noopener noreferrer">
        <g-image alt="Twitter" class="author__social" src="~/assets/images/social/twitter.svg" width="24" height="24" />
      </a>
      <a href="https://github.com/morganmccol" target="_blank" rel="noopener noreferrer">
        <g-image alt="GitHub" class="author__social" src="~/assets/images/social/github.svg" width="24" height="24" />
      </a>
      <a href="https://drive.google.com/file/d/0B0DjQ1rFeHN5YXpIVUFISGJtTnc" target="_blank" rel="noopener noreferrer">
        <g-image alt="Resume" class="author__social" src="~/assets/images/social/paper.svg" width="24" height="24" />
      </a>
    </p>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script>
export default {
  props: ['showTitle']
}
</script>

<style lang="scss">
.author {
  margin: 0 auto;
  max-width: 500px;
  text-align: center;
  padding: calc(var(--space) / 2) 0;

  &__image {
    width: 90px;
    height: 90px;
    margin-bottom: 1em;
  }

  &__intro {
    opacity: .8;
  }

  &__site-title {
    font-size: 1.5em;
  }

  &__links {
    a {
      margin: 0 .5em;
    }
  }
}
</style>
