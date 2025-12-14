// Browser API tool functions

export const createBrowserTools = () => {
  return {
    save_to_storage: async (input: {
      key: string
      value: any
    }) => {
      try {
        const { key, value } = input
        const serialized = JSON.stringify(value)
        localStorage.setItem(key, serialized)

        return {
          saved: true,
        }
      } catch (error) {
        console.error(
          "Error saving to storage:",
          error,
        )
        return {
          saved: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to save to storage",
        }
      }
    },

    get_from_storage: async (input: {
      key: string
    }) => {
      try {
        const { key } = input
        const serialized =
          localStorage.getItem(key)

        if (serialized === null) {
          return {
            value: null,
            found: false,
          }
        }

        const value = JSON.parse(serialized)
        return {
          value,
          found: true,
        }
      } catch (error) {
        console.error(
          "Error getting from storage:",
          error,
        )
        return {
          value: null,
          found: false,
        }
      }
    },

    copy_to_clipboard: async (input: {
      text: string
    }) => {
      try {
        const { text } = input

        if (!navigator.clipboard) {
          const textArea =
            document.createElement("textarea")
          textArea.value = text
          textArea.style.position = "fixed"
          textArea.style.left = "-999999px"
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)

          return { copied: true }
        }

        await navigator.clipboard.writeText(text)
        return { copied: true }
      } catch (error) {
        console.error(
          "Error copying to clipboard:",
          error,
        )
        return {
          copied: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to copy to clipboard",
        }
      }
    },

    get_user_location: async () => {
      try {
        if (!navigator.geolocation) {
          return {
            success: false,
            error:
              "Geolocation is not supported by this browser",
          }
        }

        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude:
                  position.coords.latitude,
                longitude:
                  position.coords.longitude,
                success: true,
              })
            },
            (error) => {
              let errorMessage =
                "Failed to get location"
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage =
                    "User denied the request for geolocation"
                  break
                case error.POSITION_UNAVAILABLE:
                  errorMessage =
                    "Location information is unavailable"
                  break
                case error.TIMEOUT:
                  errorMessage =
                    "The request to get user location timed out"
                  break
              }

              resolve({
                success: false,
                error: errorMessage,
              })
            },
            {
              timeout: 10000,
              maximumAge: 60000,
            },
          )
        })
      } catch (error) {
        console.error(
          "Error getting user location:",
          error,
        )
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to get location",
        }
      }
    },
  }
}
