/* options */

const keysWithDefault = [
    ['apiKey', 'your key'],
    ['model', 'text-davinci-003'],
    ['temperature', '1'],
    ['selector', 'textarea[name="comment[body]"]'],
    ['prompt', '이 github 코멘트를 보는 사람의 기분을 좋게 하고 더 도움이 되는 코멘트로 개선해줘']
];
chrome.storage.sync.get('options', ({options}) => {
    keysWithDefault.forEach(([key, defaultValue]) => {
        document.getElementById(key).value = options ? options[key] : defaultValue;
    });
})

document.getElementById('saveBtn').addEventListener('click', () => {
    const options = {};
    keysWithDefault.forEach(([key, defaultValue]) => {
        options[key] = document.getElementById(key).value;
    });
    chrome.storage.sync.set({ options }, () => {
        alert('저장되었습니다.');
    });
})