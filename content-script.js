let resultElement = null;
const keysWithDefault = [
    ['api_key', 'your key'],
    ['model', 'text-davinci-003'],
    ['temperature', '0.7'],
    ['max_tokens', '1000'],
    ['selector', 'textarea[name="comment[body]"]:focus'],
    ['prompt', '이 github 코멘트를 보는 사람의 기분을 좋게 하고 더 도움이 되는 코멘트로 개선해줘']
];
let lastComment = null;
chrome.storage.sync.get("options", ({options}) => {
    if (!options) {
        options = keysWithDefault.reduce((acc, [key, defaultValue]) => {
            acc[key] = defaultValue;
            return acc;
        })
        chrome.storage.sync.set({options});
    }
    const analyzeComment = async (comment) => {
        resultElement.innerHTML = `<marquee>분석중...제발 말 좀 곱게 합시다...</marquee>`;
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                {type: "analyzeComment", comment, options},
                (improvedComment) => {
                    resolve(improvedComment);
                }
            );
        })
    }

    const onInput = async (event) => {
        const comment = event.target.value;
        if (comment.trim().length === 0 || comment === lastComment) return
        lastComment = comment;
        const improvedComment = await analyzeComment(comment);
        resultElement.innerHTML = `<p><strong>이렇게 써보는 것은 어떨까요?</strong> from better comment</p><p>${improvedComment}</p>`;
        observer.observe(document.body, {childList: true, subtree: true})
    };

    const observeCommentBox = () => {
        const commentBox = document.querySelector(options.selector);
        console.log(commentBox)
        if (commentBox) {
            console.log(commentBox)
            resultElement = document.createElement("div");
            commentBox.parentElement.appendChild(resultElement);
            commentBox.addEventListener("blur", onInput);
            return true;
        }
        return false;
    };

    const observer = new MutationObserver(() => {
        if (!observeCommentBox()) {
            setTimeout(observeCommentBox, 1000);
        } else {
            observer.disconnect();
        }
    });
    observer.observe(document.body, {childList: true, subtree: true})
});

