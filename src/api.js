import config from '@/config'

async function getCurrencies() {
  try {
    const response = await fetch(`${config.api}/v1/currencies?active=true&fixedRate=true`)
    const currencies = await response.json()
    return currencies
    // return currencies.filter(currency => currency.featured)
  } catch (error) {
    console.warn('Error ---- getCurrencies', error)
  }
}

async function getMinimalExchange(fromCurrency, toCurrency) {
  try {
    const response = await fetch(`${config.api}/v1/min-amount/${fromCurrency}_${toCurrency}?api_key=${config.key}`)
    if (response.status >= 400) return null
    return await response.json()
  } catch (error) {
    console.warn('Error ---- getMinimalExchange', error)
  }
}

async function getEstimatedExchange(fromCurrency, toCurrency, fromValue) {
  try {
    const response = await fetch(`${config.api}/v1/exchange-amount/${fromValue}/${fromCurrency}_${toCurrency}/?api_key=${config.key}`)
    return await response.json()
  } catch (error) {
    console.warn('Error ---- getEstimatedExchange', error)
  }
}

export default {
  getCurrencies,
  getMinimalExchange,
  getEstimatedExchange
}