export const questions = [
    {
        title: "Write a love poem",
        prompt: "Write a love poem for my {relationship} named {name} and include that I bought {pronoun} a secret KitKat",
        inputs: [
            { type: "text", name: "relationship", label: "relationship" },
            { type: "text", name: "name", label: "name" },
            { type: "text", name: "pronoun", label: "pronoun" },
        ],
    },

];