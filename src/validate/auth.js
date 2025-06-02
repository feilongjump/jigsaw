export function emailValidate(value) {
  if (!value) {
    return '邮箱不能为空'
  }
  if (!/^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
    return '邮箱格式不正确'
  }
  return null
}

export function usernameValidate(value) {
  if (!value) {
    return '用户名不能为空'
  }
  if (value.length < 5) {
    return '用户名长度不能小于 5'
  }
  if (value.length > 16) {
    return '用户名长度不能大于 16'
  }

  return null
}

export function passwordValidate(value) {
  if (!value) {
    return '密码不能为空'
  }
  if (value.length < 6) {
    return '密码长度不能小于 6'
  }

  return null
}
