import * as React from "react";
import * as ReactDOM from "react-dom";
import PageEvent from "./PageEvent";
import { EmotionComponent } from "./component/EmotionComponent";

const addReactDom = (
    nodeAppender: (node: Node) => void,
    id: string,
    component: JSX.Element
) => {
    const e = document.createElement("div");
    if (document.getElementById(id)) {
        return;
    }
    e.id = id;
    nodeAppender(e);
    ReactDOM.render(component, e);
    console.log(`component added: ${id}`);
};

const main = () => {
    const ev = new PageEvent(document.getElementById("root") as HTMLElement);
    // コメントエディタがレンダリングされたとき
    ev.registerListener("leftCommentContent", () => {
        console.log("leftCommentContent");
        addReactDom(
            (e) =>
                document
                    .querySelector(
                        "#expnadableArea .comment-editor__control-area-left"
                    )
                    ?.after(e),
            "emotion-component",
            <EmotionComponent />
        );
    });
};

console.log("start");
window.addEventListener("load", main);
console.log("end");
