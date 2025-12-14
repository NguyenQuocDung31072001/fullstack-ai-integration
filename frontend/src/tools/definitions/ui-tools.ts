// UI control tool functions
import toast from "react-hot-toast"

export const createUIToolsWithContext = (
  getContext: () => any,
) => {
  return {
    show_notification: async (input: {
      message: string
      type:
        | "success"
        | "error"
        | "info"
        | "warning"
      duration?: number
    }) => {
      try {
        const {
          message,
          type,
          duration = 4000,
        } = input

        switch (type) {
          case "success":
            toast.success(message, { duration })
            break
          case "error":
            toast.error(message, { duration })
            break
          case "info":
            toast(message, {
              duration,
              icon: "ℹ️",
            })
            break
          case "warning":
            toast(message, {
              duration,
              icon: "⚠️",
            })
            break
          default:
            toast(message, { duration })
        }

        return { shown: true }
      } catch (error) {
        console.error(
          "Error showing notification:",
          error,
        )
        return { shown: false }
      }
    },

    toggle_sidebar: async (input: {
      open?: boolean
    }) => {
      try {
        const context = getContext()

        if (input.open !== undefined) {
          context.setIsSidebarOpen(input.open)
          return { isOpen: input.open }
        } else {
          const newState = !context.isSidebarOpen
          context.setIsSidebarOpen(newState)
          return { isOpen: newState }
        }
      } catch (error) {
        console.error(
          "Error toggling sidebar:",
          error,
        )
        const context = getContext()
        return { isOpen: context.isSidebarOpen }
      }
    },

    change_model: async (input: {
      provider: "openai" | "anthropic" | "gemini"
      model: string
    }) => {
      try {
        const context = getContext()
        const { provider, model } = input

        context.setModelConfig({
          provider,
          model,
        })

        return {
          success: true,
          provider,
          model,
        }
      } catch (error) {
        console.error(
          "Error changing model:",
          error,
        )
        const context = getContext()
        return {
          success: false,
          provider: context.modelConfig.provider,
          model: context.modelConfig.model,
        }
      }
    },

    update_ui_theme: async (input: {
      theme: "light" | "dark" | "auto"
    }) => {
      try {
        const { theme } = input

        const root = document.documentElement

        if (theme === "dark") {
          root.classList.add("dark")
          localStorage.setItem("theme", "dark")
        } else if (theme === "light") {
          root.classList.remove("dark")
          localStorage.setItem("theme", "light")
        } else {
          localStorage.removeItem("theme")
          if (
            window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches
          ) {
            root.classList.add("dark")
          } else {
            root.classList.remove("dark")
          }
        }

        return {
          theme,
          success: true,
        }
      } catch (error) {
        console.error(
          "Error updating theme:",
          error,
        )
        const currentTheme =
          document.documentElement.classList.contains(
            "dark",
          )
            ? "dark"
            : "light"
        return {
          theme: currentTheme,
          success: false,
        }
      }
    },
  }
}
