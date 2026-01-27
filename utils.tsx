
export const getDifficultyColor = (difficulty: string) => {
    console.log(difficulty)
    switch(difficulty) {
        case "Easy":
            return { bg: "bg-green-200", text: "text-green-800" }
        case "Medium":
            return { bg: "bg-yellow-200", text: "text-yellow-800" }
        case "Hard":
            return { bg: "bg-red-200", text: "text-red-800" }
        default:
            return { bg: "bg-gray-200", text: "text-gray-800" }
    }
}