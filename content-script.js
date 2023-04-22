// This function will be injected into the page and will run in the context of the webpage

  const inputSelector = 'textarea[name="comment[body]"]';
  const resultElement = document.createElement("div");

  const analyzeComment = async (comment) => {
    resultElement.innerHTML = `<marquee>분석중...제발 말 좀 곱게 합시다...</marquee>`;
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
          {type: "analyzeComment", comment: comment},
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
    const commentBox = document.querySelector(inputSelector);
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

  observer.observe(document.body, { childList: true, subtree: true });
