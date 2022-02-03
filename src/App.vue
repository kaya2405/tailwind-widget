<template>
  <div  class="h-full w-full flex flex-col items-center justify-center">
    <CurrencyExchange/>
</div>
</template>

<script>
import CurrencyExchange from '@/components/CurrencyExchange.vue'

export default {
  name: 'App',
  components: {
    CurrencyExchange
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  font-family: vollkorn;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}

input:focus-visible {
  outline: 0;
  outline-offset: 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
}

input[type="number"] { -moz-appearance: textfield; }

::-webkit-scrollbar {
  width: 0;
}
</style>
