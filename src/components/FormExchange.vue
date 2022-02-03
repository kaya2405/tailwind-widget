<template>
  <div class="container relative" style="max-width: 950px; max-height: 163px">
    <div class="exchange-box flex flex-col justify-center gap-4 lg:flex-row lg:justify-between lg:items-center">
      <CurrencyEdit @select="changeFromCurrency" @change="changeFrom" :value="from" :currencies="currencies"
        :image="fromCurrency.image" :ticker="fromCurrency.ticker.slice(0, 4)" :blockedCurrency="toCurrency" :hideInput="true"/>
      <button class="self-end lg:self-center" @click="swap"><SwapIcon class="transform rotate-90 lg:rotate-180"/></button>
      <CurrencyEdit @select="changeToCurrency" :value="to" :currencies="currencies"
        :image="toCurrency.image" :ticker="toCurrency.ticker.slice(0, 4)" :blockedCurrency="fromCurrency" :disabled="true" :hideInput="!minimalValue"/>
    </div>
    <div class="pt-8 pb-1">Your Ethereum address</div>
    <div class="flex flex-col gap-4 lg:flex-row lg:justify-between">
      <div class="rounded-md w-82 lg:w-723px h-50px"><input class="w-full h-full pl-5 rounded-md bg-gray-100 border border-gray-200" type="text"></div>
      <button class="button rounded-md select-none w-82 h-50px lg:w-51 font-bold text-white uppercase"><p class="pt-1">Exchange</p></button>
      <div class="flex flex-col w-82 h-50px lg:w-51 lg:absolute lg:-right-4 lg:-bottom-14">
        <div v-show="minimalValue" class="text-red-600 text-center">The minimum exchange amount is <code class="font-mono">{{ minAmount }}</code></div>
        <div v-show="disabledPair" class="text-red-600 text-center">This pair is disabled now</div>
        <div v-show="maxAmount" class="text-red-600 text-center" >Max amount exceeded {{ fromCurrency.ticker }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import CurrencyEdit from '@/components/CurrencyEdit.vue'
import SwapIcon from '@/assets/icons/SwapIcon.vue'
import api from '@/api'

export default {
  name: 'FormExchange',
  components: {
    CurrencyEdit,
    SwapIcon
  },
  data () {
    return {
      currencies: [],
      from: 0,
      to: 0,
      minAmount: 0,
      maxAmount: false,
      minimalValue: false,
      disabledPair: false,
      fromCurrency: {
        image: '',
        ticker: ''
      },
      toCurrency: {
        image: '',
        ticker: ''
      }
    }
  },
  async created() {
    await this.loadCurrencies()
    await this.loadMinimalExchange()
    this.from = await this.minAmount
    await this.loadEstimatedExchange(this.from)
  },
  methods: {
    changeFromCurrency(currency) {
      this.fromCurrency = currency
      this.loadMinimalExchange()
      this.from = this.minAmount
    },
    changeToCurrency(currency) {
      this.toCurrency = currency
      this.loadEstimatedExchange(this.from)
    },
    changeFrom(value) {
      if (this.disabledPair) return
      this.minimalValue = value < this.minAmount
      if (value < this.minAmount || !value) {
        this.to = 0
        return
      }
      this.from = value
      this.loadEstimatedExchange(value)
    },
    async swap() {
      const objFrom = await this.fromCurrency
      this.fromCurrency = await this.toCurrency
      this.toCurrency = await objFrom
      await this.loadMinimalExchange()
      this.changeFrom(this.from)
    },
    async loadCurrencies() {
      try {
        const result = await api.getCurrencies()
        this.currencies = result
        this.fromCurrency = this.currencies[0]
        this.toCurrency = this.currencies[1]
      } catch (error) {
        console.error('ERROR --- loadCurrencies', error)
      }
    },
    async loadMinimalExchange() {
      try {
        const result = await api.getMinimalExchange(this.fromCurrency.ticker, this.toCurrency.ticker)
        this.disabledPair = !result
        this.minAmount = result?.minAmount ?? 0
      } catch (error) {
        console.error('ERROR --- loadMinimalExchange', error)
      }
    },
    async loadEstimatedExchange(from) {
      try {
        const result = await api.getEstimatedExchange(this.fromCurrency.ticker, this.toCurrency.ticker, from)
        if (result.error === 'max_amount_exceeded') {
          this.maxAmount = true
          this.to = 0
          return
        }
        if (!result?.estimatedAmount) {
          this.disabledPair = true
          return
        }
        this.disabledPair = false
        this.maxAmount = false
        this.to = result.estimatedAmount
      } catch (error) {
        console.error('ERROR --- loadEstimatedExchange', error)
      }
    }
  }
}
</script>

<style lang="scss">
.button {
  background-color: #11B3FE;

  &:hover {
    background-color: #0095e0;
  }
}
</style>
