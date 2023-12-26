import * as React from "react";
import { callOpenAIRequest, triggerChangeEvent } from "../Utils";

async function onClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    ev.preventDefault();
    const inputText = document
        .querySelector("#descriptionTextArea")
        ?.textContent?.trim();
    if (!inputText) {
        return;
    }
    const elm = document.querySelector<HTMLInputElement>("#summaryInput");
    if (!elm) {
        return;
    }
    elm.value = "生成中...";
    const prompt = `「===」より後で示す文章をまとめて、issueのタイトルを出力してください。タイトルは200文字以内で出力してください。
    ===
    ${inputText}
    `;
    const response = await callOpenAIRequest(prompt, 200, 0);
    if (!response) {
        return "読み込みに失敗しました";
    }
    const obj = JSON.parse(response.body);
    const res = obj.choices[0].text.trim();
    elm.value = res;
    triggerChangeEvent(elm);
    return;
}

export const IssueTitleComponent = () => {
    return (
        <>
            <button
                className="button button button--weak -w-fixed-small"
                onClick={onClick}
            >
                タイトルを生成
            </button>
        </>
    );
};
