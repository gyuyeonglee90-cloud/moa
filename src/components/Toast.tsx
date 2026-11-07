interface ToastProps {
  message: string | null
}

/** 디자인 시스템 7장: 검정 알약 + 흰 글자, 3초 후 사라짐(표시 여부는 호출부가 관리) */
export default function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div className="absolute inset-x-4 bottom-20 z-[70] flex justify-center">
      <div role="status" className="rounded-full bg-ink px-4 py-2 text-body-sm text-white shadow-level2">
        {message}
      </div>
    </div>
  )
}
