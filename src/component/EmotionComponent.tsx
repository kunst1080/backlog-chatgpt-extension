import * as React from "react";
import { calculateMD5, callOpenAIRequest, loadData } from "../Utils";

const CACHE_EXPIRE_MILLIS = 1000 * 60 * 60 * 24 * 7; // 1 week
const REQUEST_INTERVAL = 10000;

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
        .querySelector("#leftCommentContent > p")
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
    const obj = JSON.parse(response.body);
    const arr = obj.choices[0].text.trim().split(",");
    console.log(obj.choices[0].text.trim());
    return {
        joy: arr[0] ? parseInt(arr[0]) : 0,
        anger: arr[1] ? parseInt(arr[1]) : 0,
        sadness: arr[2] ? parseInt(arr[2]) : 0,
        pleasure: arr[3] ? parseInt(arr[3]) : 0,
    };
};

const updateSubmitButton = (e: Emotion) => {
    const button = document.querySelector(
        "#switchStatusAddCommentForm button[type=submit]"
    ) as HTMLInputElement;
    if (!button) {
        return;
    }
    if (e.anger > 5 || e.sadness > 5) {
        button.textContent = "怒り・悲しみを抑えてコメントする";
        button.disabled = true;
    } else if (e.joy < 2 && e.pleasure < 2) {
        button.textContent = "喜び・楽しみを増やしてコメントする";
        button.disabled = true;
    } else {
        button.textContent = "登録";
        button.disabled = false;
    }
};

const getClassName = (emotion: Emotion): string => {
    if (emotion == INITIAL_EMOTION) {
        return "emotion-safe";
    }
    if (emotion.anger > 5 || emotion.sadness > 5) {
        return "emotion-danger";
    }
    if (emotion.joy < 5 || emotion.pleasure < 5) {
        return "emotion-warning";
    }
    return "emotion-safe";
};
export const EmotionComponent = () => {
    const [emotion, setEmotion] = React.useState<Emotion>(INITIAL_EMOTION);
    React.useEffect(() => {
        const update = () => {
            loadEmotion().then((e) => {
                updateSubmitButton(e);
                setEmotion(e);
            });
        };
        const timer = setInterval(update, REQUEST_INTERVAL);
        // useEffectのクリーンアップ関数でタイマーをクリア
        return () => clearInterval(timer);
    }, []);
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
