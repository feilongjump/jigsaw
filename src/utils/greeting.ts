export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 5)
    return '凌晨了，要注意休息 🌙'
  if (hour < 11)
    return '早上好啊！新的一天，新的快乐！ ☀️'
  if (hour < 13)
    return '中午好，有空要小憩一会 ☕'
  if (hour < 19)
    return '下午好，饿了就吃点东西垫巴垫巴 🍪'
  return '晚上好，准备睡觉咯 🛌'
}
