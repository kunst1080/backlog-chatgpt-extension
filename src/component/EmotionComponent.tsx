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
    const prompt = `あなたは、世界でも有数の精神分析家です。
文章から、著者の心理状態を分析することに長けています。
次の文章をもとに心理分析してください。
joy, anger, sadness, pleasureの4つの感情の値をそれぞれ0〜9の値で返答してください。
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

export const EmotionComponent = () => {
    const [emotion, setEmotion] = React.useState<Emotion>(INITIAL_EMOTION);
    React.useEffect(() => {
        const update = () => {
            loadEmotion().then((e) => setEmotion(e));
        };
        const timer = setInterval(update, REQUEST_INTERVAL);
        // useEffectのクリーンアップ関数でタイマーをクリア
        return () => clearInterval(timer);
    }, []);
    return (
        <div>
            <div>喜:{emotion.joy}</div>
            <div>怒:{emotion.anger}</div>
            <div>哀:{emotion.sadness}</div>
            <div>楽:{emotion.pleasure}</div>
        </div>
    );
};
