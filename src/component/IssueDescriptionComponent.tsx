import * as React from "react";
import { callOpenAIRequest, escapeHTML, triggerChangeEvent } from "../Utils";

async function onClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    ev.preventDefault();
    const inputText = document
        .querySelector<HTMLInputElement>("#summaryInput")
        ?.value?.trim();
    if (!inputText) {
        return;
    }
    const elm = document.querySelector<HTMLInputElement>(
        "#descriptionTextArea"
    );
    if (!elm) {
        return;
    }
    elm.textContent = "生成しています...";

    const prompt = `issueのタイトル「${inputText}」をもとに、issueの内容を出力してください。内容は600文字以内で出力してください。`;
    const response = await callOpenAIRequest(prompt, 1000, 0);
    if (!response) {
        window.alert("読み込みに失敗しました");
    }
    const obj = JSON.parse(response);
    const res = obj.choices[0].text.trim();
    const lines = res
        .split("\n")
        .map((s: string) => `<p>${escapeHTML(s)}</p>`)
        .join("");
    elm.innerHTML = lines;
    triggerChangeEvent(elm);
}

export const IssueDescriptionComponent = () => {
    return (
        <>
            <button
                className="button button button--weak -w-fixed-small"
                onClick={onClick}
            >
                課題の内容を生成
            </button>
        </>
    );
};
