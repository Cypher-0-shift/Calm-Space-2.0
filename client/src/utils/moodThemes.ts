export const moodThemes = {
  Happy: {
    background: "from-yellow-100 via-orange-100 to-orange-200",
    text: "text-yellow-800",
    accent: "bg-yellow-500",
    border: "border-yellow-300"
  },
  Sad: {
    background: "from-blue-100 via-blue-200 to-blue-300",
    text: "text-blue-900",
    accent: "bg-blue-500",
    border: "border-blue-300"
  },
  Anxious: {
    background: "from-purple-100 via-purple-200 to-indigo-200",
    text: "text-purple-900",
    accent: "bg-purple-500",
    border: "border-purple-300"
  },
  Angry: {
    background: "from-red-100 via-red-200 to-orange-300",
    text: "text-red-900",
    accent: "bg-red-500",
    border: "border-red-300"
  },
  Stressed: {
    background: "from-pink-100 via-pink-200 to-red-200",
    text: "text-pink-900",
    accent: "bg-pink-500",
    border: "border-pink-300"
  },
  Tired: {
    background: "from-gray-100 via-blue-100 to-gray-200",
    text: "text-gray-800",
    accent: "bg-gray-500",
    border: "border-gray-300"
  },
  Default: {
    background: "from-purple-100 via-pink-50 to-blue-100",
    text: "text-gray-800",
    accent: "bg-purple-500",
    border: "border-purple-300"
  }
} as const;
