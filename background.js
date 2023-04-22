chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "analyzeComment") {
    analyzeComment(request.comment, sendResponse);
    return true; // Required to use sendResponse asynchronously
  }
});
const analyzeComment = async (comment, sendResponse) => {
    // Implement the analyzeComment function using the OpenAI API
    // (same as before, but as a string since it will be injected)
    const prompt = `코드에 대한 이 github코멘트를 보는 사람의 기분을 좋게 하고 더 도움이 되는 코멘트로 개선해줘: "${comment}"`;

    const apiKey = "your api key"; // Replace with a secure method of providing the API key

    const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 1000,
            n: 1,
            stop: null,
            temperature: 0.7,
        }),
    });
    const data = await response.json();
    const improvedComment = data.choices[0].text.trim();
    sendResponse(improvedComment);
}