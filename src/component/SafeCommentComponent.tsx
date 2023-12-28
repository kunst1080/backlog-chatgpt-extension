import * as React from "react";
import { calculateMD5, callOpenAIRequest, loadData } from "../Utils";
import DomEvent from "../DomEvent";

const CACHE_EXPIRE_MILLIS = 1000 * 60 * 60 * 24 * 7; // 1 week

type Emotion = {
    joy: number;
    anger: number;
    sadness: number;
    pleasure: number;
};

const INITIAL_EMOTION: Emotion = {
    joy: 0,
    anger: 0,
    sadness: 0,
    pleasure: 0,
};

const loadEmotion = async (): Promise<Emotion> => {
    const inputText = document
        .querySelector("#leftCommentContent")
        ?.textContent?.trim();
    if (!inputText) {
        return INITIAL_EMOTION;
    }
    const prompt = `課題管理システムのコメント欄から、書き手の感情の度合いを分析します。
    以下の文章からjoy, anger, sadness, pleasureの4つの感情の値をそれぞれ0〜9の値で返答してください。
    返答の出力形式は、joy, anger, sadness, pleasureの順にカンマ区切りで出力してください。
    出力の例: 1,5,7,2
    分析したい文章: ${inputText}
    `;
    const response = await loadData(
        calculateMD5(inputText),
        CACHE_EXPIRE_MILLIS,
        () => callOpenAIRequest(prompt, 8, 0)
    );
    if (!response) {
        return INITIAL_EMOTION;
    }
    const obj = JSON.parse(response);
    const arr = obj.choices[0].text.trim().split(",");
    return {
        joy: arr[0] ? parseInt(arr[0]) : 0,
        anger: arr[1] ? parseInt(arr[1]) : 0,
        sadness: arr[2] ? parseInt(arr[2]) : 0,
        pleasure: arr[3] ? parseInt(arr[3]) : 0,
    };
};

const updateSubmitButton = (e: Emotion) => {
    const buttons = document.querySelectorAll(
        ".comment-editor button[type=submit]"
    );
    if (!buttons) {
        return;
    }
    if (e == INITIAL_EMOTION) {
        buttons.forEach((b) => {
            const button = b as HTMLInputElement;
            button.disabled = true;
            button.textContent = "コメントを入力してください";
        });
    }
    if (e.anger > 5 || e.sadness > 5) {
        buttons.forEach((b) => {
            const button = b as HTMLInputElement;
            button.disabled = true;
            button.textContent = "怒り・悲しみを抑えてコメントする";
        });
    } else if (e.joy < 2 && e.pleasure < 2) {
        buttons.forEach((b) => {
            const button = b as HTMLInputElement;
            button.disabled = true;
            button.textContent = "喜び・楽しみを増やしてコメントする";
        });
    } else {
        buttons.forEach((b) => {
            const button = b as HTMLInputElement;
            button.disabled = false;
            button.textContent = "登録";
        });
    }
};

const getClassName = (emotion: Emotion): string => {
    if (emotion == INITIAL_EMOTION) {
        return "emotion-safe";
    }
    if (emotion.anger > 5 || emotion.sadness > 5) {
        return "emotion-danger";
    }
    if (emotion.joy < 5 && emotion.pleasure < 5) {
        return "emotion-warning";
    }
    return "emotion-safe";
};
export const SafeCommentComponent = () => {
    const [emotion, setEmotion] = React.useState<Emotion>(INITIAL_EMOTION);
    React.useEffect(() => {
        // 初期表示
        loadEmotion().then((e) => {
            setEmotion(e);
        });
        // 入力エリアからフォーカスが外れたとき
        document
            .querySelector("#leftCommentContent")
            ?.addEventListener("blur", (ev) => {
                loadEmotion().then((e) => {
                    setEmotion(e);
                });
            });
        const ev = new DomEvent(
            document.querySelector("#commentArea") as HTMLElement
        );
        // プレビュー表示時
        ev.registerListener("#commentArea", () => {
            loadEmotion().then((e) => {
                setEmotion(e);
            });
        });
    }, []);
    updateSubmitButton(emotion);
    return (
        <div>
            <div className={`emotion-area ${getClassName(emotion)}`}>
                <div>喜:{emotion.joy}</div>
                <div>怒:{emotion.anger}</div>
                <div>哀:{emotion.sadness}</div>
                <div>楽:{emotion.pleasure}</div>
            </div>
        </div>
    );
};
