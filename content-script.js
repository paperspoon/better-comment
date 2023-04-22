const resultElement = document.createElement("div");
chrome.storage.sync.get("options", ({options}) => {
    if (!options) {
        alert("Please set your options in the extension settings. from better comment extension");
    }
    const analyzeComment = async (comment) => {
        resultElement.innerHTML = `<marquee>분석중...제발 말 좀 곱게 합시다...</marquee>`;
        console.log(options)
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
        if (comment.trim().length === 0) return
        const improvedComment = await analyzeComment(comment);
        resultElement.innerHTML = `<p><strong>이렇게 써보는 것은 어떨까요?</strong> from better comment</p><p>${improvedComment}</p>`;
    };

    const observeCommentBox = () => {
        const commentBox = document.querySelector(options.selector);
        if (commentBox) {
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

