import * as React from "react";
import { calculateMD5, callOpenAIRequest, loadData } from "../Utils";

const CACHE_EXPIRE_MILLIS = 1000 * 60 * 60 * 24 * 7; // 1 week

const loadSummary = async (): Promise<string> => {
    const inputText = document
        .querySelector("#descriptionTextArea")
        ?.textContent?.trim();
    if (!inputText) {
        return "";
    }
    const prompt = `「===」より後で示す文章を200文字以内で要約してください。要約には推測を含めず、事実だけを含めてください。
返答の形式は、要約の結果のみを200文字以内の文字列で出力してください。要約と関係のない、説明などの文章は出力しないでください。
===
${inputText}
`;
    const response = await loadData(
        calculateMD5(inputText),
        CACHE_EXPIRE_MILLIS,
        () => callOpenAIRequest(prompt, 200, 0)
    );
    if (!response) {
        return "読み込みに失敗しました";
    }
    const obj = JSON.parse(response.body);
    const res = obj.choices[0].text.trim();
    return res;
};

export const IssueSummaryComponent = () => {
    const [aiSummary, setAISummary] = React.useState<string>("");
    React.useEffect(() => {
        // 初期表示
        loadSummary().then((s) => {
            setAISummary(s);
        });
        // 入力エリアからフォーカスが外れたとき
        document
            .querySelector("#descriptionTextArea")
            ?.addEventListener("blur", (ev) => {
                loadSummary().then((s) => {
                    setAISummary(s);
                });
            });
    }, []);
    return (
        <div>
            <h3>要約</h3>
            <div>{aiSummary}</div>
        </div>
    );
};
