import * as React from "react";
import * as ReactDOM from "react-dom";
import DomEvent from "./DomEvent";
import { SafeCommentComponent } from "./component/SafeCommentComponent";
import Config from "./Config";
import { IssueSummaryComponent } from "./component/IssueSummaryComponent";

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
    console.log(`Component rendered: ${id}`);
};

const main = async () => {
    // 設定を読み込む
    const config = await Config.load();
    // 設定されたスペースでのみ有効
    if (!location.hostname.startsWith(config.spaceKey + ".")) {
        return;
    } else {
        const manifest = chrome.runtime.getManifest();
        console.log(`${manifest.name} ${manifest.version} is enabled.`);
    }
    const ev = new DomEvent(document.getElementById("root") as HTMLElement);
    if (config.enableSafeComment) {
        ev.registerListener("#leftCommentContent", () => {
            addReactDom(
                (e) =>
                    document
                        .querySelector(
                            "#expnadableArea .comment-editor__control-area-left"
                        )
                        ?.after(e),
                "safe-comment-component",
                <SafeCommentComponent />
            );
        });
    }
    if (config.enableIssueSummary) {
        if (
            location.pathname.startsWith("/view/") &&
            location.pathname.endsWith("/edit")
        ) {
            ev.registerListener("#descriptionTextArea", () => {
                addReactDom(
                    (e) =>
                        document
                            .querySelector(".ticket__properties-value")
                            ?.after(e),
                    "issue-summary-component",
                    <IssueSummaryComponent />
                );
            });
        }
    }
};

window.addEventListener("load", main);
