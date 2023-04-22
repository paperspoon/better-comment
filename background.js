chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "analyzeComment" && request.options) {
    analyzeComment(request.comment, request.options).then(sendResponse)
  }
  return true
})
const analyzeComment = async (comment, options) => {
    const {prompt, api_key, temperature, max_tokens, model} = options;

    const response = await fetch(`https://api.openai.com/v1/engines/${model}/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${api_key}`,
        },
        body: JSON.stringify({
            prompt: `${prompt}: "${comment}"`,
            max_tokens: Number(max_tokens),
            n: 1,
            stop: null,
            temperature: Number(temperature)
        }),
    });
    const data = await response.json();
    if (data.error) {
        return data.error.message;
    }
    return data.choices[0].text.trim();
}