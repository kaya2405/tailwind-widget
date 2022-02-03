<template>
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-2 items-center lg:items-start">
        <div class="font-light text-40px lg:text-50px">Crypto Exchange</div>
        <div class="font-light text-20px">Exchange fast and easy</div>
      </div>
      <FormExchange/>
    </div>
</template>

<script>
import FormExchange from './FormExchange.vue'

export default {
  name: 'CurrencyExchange',
  components: {
    FormExchange
  }
}
</script>