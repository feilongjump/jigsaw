import { Button, Link } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/auth/otp')({
  component: TwoSteps,
})

function TwoSteps() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }, [])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (Number.isNaN(Number(element.value)))
      return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    // Focus next input
    if (element.value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6)
    if (!/^\d+$/.test(pastedData))
      return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, i) => {
      if (i < 6)
        newOtp[i] = char
    })
    setOtp(newOtp)
    inputsRef.current[Math.min(pastedData.length, 5)]?.focus()
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="Jigsaw" className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-default-900">两步验证</h1>
        <p className="text-small text-default-500 mt-2">
          我们已向您的电子邮箱发送了验证码，请在下方输入。
        </p>
        <p className="text-small font-bold text-default-900 mt-4">******1234</p>
      </div>

      <div className="flex flex-col gap-6">
        <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-default-700">请输入6位安全验证码</label>
            <div className="flex gap-2 justify-between">
              {otp.map((data, index) => (
                <input
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  ref={(el) => { inputsRef.current[index] = el }}
                  className="h-12 w-12 rounded-xl border-2 border-default-200 bg-default-50 text-center text-xl text-default-900 focus:border-primary focus:outline-none transition-colors"
                  type="text"
                  name="otp"
                  maxLength={1}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
          </div>

          <Button color="primary" type="submit" className="w-full font-medium shadow-lg shadow-primary/20">
            验证我的账户
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2">
          <span className="text-small text-default-500">没有收到验证码？</span>
          <Link href="#" className="text-small text-primary font-medium hover:underline">
            重新发送
          </Link>
        </div>
      </div>
    </div>
  )
}
