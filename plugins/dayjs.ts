import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'

dayjs.locale(zhCN)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs,
    },
  }
})
