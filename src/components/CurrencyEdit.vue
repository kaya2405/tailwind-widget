<template>
  <div class="flex w-82 lg:w-110">
    <div class="w-full h-50px flex items-center rounded-md bg-gray-100 border border-gray-200">
      <div class="w-72 h-7 bg-gray-100">
        <input v-show="hideInput" :disabled="disabled" :value="value" @input="onValueChange" class="h-full w-full bg-gray-100 pl-5 input font-mono" type="number" />
        <input v-show="!hideInput" :disabled="disabled" value="—" class="h-full w-full bg-gray-100 pl-5 input bold"/>
      </div>
      <button class="currency w-149px relative flex justify-center items-center gap-2.5 bg-gray-100 border-l border-gray-200" ref="currency" @click="toggle()">
        <div class="select-none"><img :src="image"></div>
        <div class="select-none pt-1">{{ ticker.toUpperCase() }}</div>
        <div class="h-5"></div>
        <div class="absolute right-2.5"><ArrowIcon/></div>
      </button>
    </div>
    <div v-show="expanded" class="w-82 h-200px lg:w-110 absolute flex flex-col rounded-md bg-gray-100 border border-gray-200 overflow-y-auto overflow-x-hidden select-none z-10">
      <div class="h-50px w-82 lg:w-110 absolute sticky -top-px flex flex-row flex-shrink-0 border-b border-gray-200">
        <input class="h-full w-full bg-gray-100 pl-5" type="text" placeholder="Search" v-model="search" ref="input" />
        <button class="w-10 h-full bg-gray-100" @click="toggle()"><CloseIcon/></button>
      </div>
      <div v-for="currency in searchCurrencies" :key="currency.ticker" @click="select(currency)" class="h-50px w-110 flex flex-row justify-start items-center gap-3 flex-shrink-0 pl-5 bg-gray-100 hover:bg-gray-200">
        <img :src="currency.image" class="w-5 h-5">
        <div class="pt-1">{{ currency.ticker.toUpperCase() }}</div>
        <div class="pt-1">{{ currency.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ArrowIcon from '@/assets/icons/ArrowIcon.vue'
import CloseIcon from '@/assets/icons/CloseIcon.vue'

export default {
  name: 'currencyEdit',
  components: {
    CloseIcon,
    ArrowIcon
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    currencies: {
      type: Array,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    ticker: {
      type: String,
      required: true
    },
    blockedCurrency: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    },
    hideInput: {
      type: Boolean,
      required: true
    }
  },
  emits: ['change', 'select'],
  data() {
    return {
      search: '',
      expanded: false
    }
  },
  computed: {
    searchCurrencies() {
      const search = this.search.trim().toLowerCase()
      const filter = search.length === 0
        ? currency => currency.ticker !== this.blockedCurrency.ticker
        : currency => currency.name.toLowerCase().includes(search) && currency.ticker !== this.blockedCurrency.ticker
      return this.currencies.filter(filter)
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
      this.search = ''
      this.$nextTick(() => this.$refs.input.focus(), 0)
    },
    select(currency) {
      this.toggle()
      this.$emit('select', currency)
    },
    onValueChange(event) {
      const value = parseFloat(event.target.value)
      this.$emit('change', value)
    }
  }
}
</script>