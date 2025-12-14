// Tool rendering components

interface ToolCallProps {
  part: any
  status?: string
}

// Custom tool call renderer - blue box styling
export const ToolCallRenderer = ({
  part,
  status,
}: ToolCallProps) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-2">
      <div className="flex items-center gap-2 mb-2">
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="font-semibold text-blue-900 text-sm">
          Tool: {part.toolName || part.name}
          {status === "in_progress" &&
            " (executing...)"}
        </span>
      </div>
      {part.args &&
        Object.keys(part.args).length > 0 && (
          <div className="text-xs text-blue-700 mb-2">
            <span className="font-semibold">
              Input:
            </span>
            <pre className="mt-1 bg-blue-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(part.args, null, 2)}
            </pre>
          </div>
        )}
      {part.result !== undefined && (
        <div className="text-xs text-green-700 mt-2">
          <span className="font-semibold">
            Result:
          </span>
          <pre className="mt-1 bg-green-100 p-2 rounded overflow-x-auto border border-green-200">
            {JSON.stringify(part.result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// Fallback renderer for unknown tools
export const ToolFallback = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-2">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="font-semibold text-gray-900 text-sm">
          Unknown Tool
        </span>
      </div>
    </div>
  )
}

// Extended thinking renderer - purple box styling
export const ThinkingRenderer = ({
  content,
}: {
  content: string
}) => {
  return (
    <div className="text-sm text-purple-600 italic mb-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
      <span className="font-semibold">
        💭 Thinking:
      </span>{" "}
      {content}
    </div>
  )
}
