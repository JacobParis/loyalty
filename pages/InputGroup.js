import { useUID } from "react-uid"

export function InputGroup({ label, className, disabled = false, ...props }) {
  const id = useUID()

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        className={`block w-56 rounded-md border-gray-300 ${
          disabled ? "bg-gray-100 text-gray-500" : "text-gray-700"
        }`}
        type="text"
        disabled={disabled}
        {...props}
      />
    </div>
  )
}
