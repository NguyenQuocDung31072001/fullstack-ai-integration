import { useState } from "react"

export interface ModelConfig {
  provider: "openai" | "anthropic" | "gemini"
  model: string
}

interface ModelSelectorProps {
  value: ModelConfig
  onChange: (config: ModelConfig) => void
}

const models = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    {
      value: "gpt-4o-mini",
      label: "GPT-4o Mini",
    },
    {
      value: "gpt-4-turbo",
      label: "GPT-4 Turbo",
    },
  ],
  anthropic: [
    {
      value: "claude-3-5-sonnet-20241022",
      label: "Claude 3.5 Sonnet",
    },
    {
      value: "claude-3-haiku-20240307",
      label: "Claude 3 Haiku",
    },
  ],
  gemini: [
    {
      value: "gemini-2.0-flash-exp",
      label: "Gemini 2.0 Flash",
    },
    {
      value: "gemini-1.5-pro",
      label: "Gemini 1.5 Pro",
    },
  ],
}

export function ModelSelector({
  value,
  onChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleProviderChange = (
    provider: "openai" | "anthropic" | "gemini",
  ) => {
    const defaultModel = models[provider][0].value
    onChange({ provider, model: defaultModel })
    setIsOpen(false)
  }

  const handleModelChange = (model: string) => {
    onChange({ ...value, model })
  }

  const currentProviderLabel =
    value.provider === "openai"
      ? "OpenAI"
      : value.provider === "anthropic"
      ? "Anthropic"
      : "Google Gemini"

  const currentModelLabel =
    models[value.provider].find(
      (m) => m.value === value.model,
    )?.label || value.model

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          {currentProviderLabel}
        </span>
        <span className="text-sm text-gray-500">
          •
        </span>
        <span className="text-sm text-gray-600">
          {currentModelLabel}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {/* OpenAI */}
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() =>
                  handleProviderChange("openai")
                }
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${
                  value.provider === "openai"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <div className="font-semibold text-sm">
                  OpenAI
                </div>
              </button>
              {value.provider === "openai" && (
                <div className="ml-2 mt-1 space-y-1">
                  {models.openai.map((model) => (
                    <button
                      key={model.value}
                      onClick={() =>
                        handleModelChange(
                          model.value,
                        )
                      }
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 ${
                        value.model ===
                        model.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {model.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Anthropic */}
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() =>
                  handleProviderChange(
                    "anthropic",
                  )
                }
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${
                  value.provider === "anthropic"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <div className="font-semibold text-sm">
                  Anthropic
                </div>
              </button>
              {value.provider === "anthropic" && (
                <div className="ml-2 mt-1 space-y-1">
                  {models.anthropic.map(
                    (model) => (
                      <button
                        key={model.value}
                        onClick={() =>
                          handleModelChange(
                            model.value,
                          )
                        }
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 ${
                          value.model ===
                          model.value
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {model.label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Google Gemini */}
            <div className="p-2">
              <button
                onClick={() =>
                  handleProviderChange("gemini")
                }
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${
                  value.provider === "gemini"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                }`}
              >
                <div className="font-semibold text-sm">
                  Google Gemini
                </div>
              </button>
              {value.provider === "gemini" && (
                <div className="ml-2 mt-1 space-y-1">
                  {models.gemini.map((model) => (
                    <button
                      key={model.value}
                      onClick={() =>
                        handleModelChange(
                          model.value,
                        )
                      }
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 ${
                        value.model ===
                        model.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {model.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
