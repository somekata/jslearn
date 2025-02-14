function loadContent(jsonFile, addToHistory = true) {
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            console.log(`📖 ${jsonFile} をロード:`, data);
            displayContent(data);
            saveLastViewed(jsonFile);

            if (addToHistory) {
                history.pushState({ page: jsonFile }, "", `?page=${jsonFile}`);
            }
        })
        .catch(error => console.error(`⚠ コンテンツの読み込みに失敗: ${jsonFile}`, error));
}

function displayContent(data) {
    const titleElement = document.getElementById("content-title");
    const bodyElement = document.getElementById("content-body");

    titleElement.textContent = data.title;
    bodyElement.innerHTML = "";

    if (Array.isArray(data.description)) {
        data.description.forEach(item => {
            createContentElement(item, bodyElement);
        });
    }

    if (Array.isArray(data.sections)) {
        data.sections.forEach(section => {
            const sectionElement = document.createElement("section");
            
            if (section.title) {
                const sectionTitle = document.createElement("h2");
                sectionTitle.textContent = section.title;
                sectionElement.appendChild(sectionTitle);
            }

            if (Array.isArray(section.content)) {
                section.content.forEach(item => {
                    createContentElement(item, sectionElement);
                });
            }

            bodyElement.appendChild(sectionElement);
        });
    }

        // ✅ Add handling for `more` sections
        if (Array.isArray(data.more)) {
            const moreContainer = document.createElement("div");
            moreContainer.classList.add("more-section");
    
            const moreTitle = document.createElement("h2");
            moreTitle.textContent = "もっと知りたい人のコーナー";
            moreContainer.appendChild(moreTitle);
    
            data.more.forEach(section => {
                const sectionElement = document.createElement("section");
                
                if (section.title) {
                    const sectionTitle = document.createElement("h3"); // Smaller heading for "more" sections
                    sectionTitle.textContent = section.title;
                    sectionElement.appendChild(sectionTitle);
                }
    
                if (Array.isArray(section.content)) {
                    section.content.forEach(item => {
                        createContentElement(item, sectionElement);
                    });
                }
    
                moreContainer.appendChild(sectionElement);
            });
    
            bodyElement.appendChild(moreContainer);
        }
}

function createContentElement(item, parentElement) {
    let element;

    if (item.type === "p") {
        element = document.createElement("p");

        // text を paragraphs に変換
        if (item.text) {
        item.paragraphs = [item.text];
        }       

        if (Array.isArray(item.paragraphs)) {
            item.paragraphs.forEach(paragraph => {
                const pElement = document.createElement("p");
                pElement.textContent = paragraph;

                if (item.attributes) {
                    applyAttributes(element, item.attributes);
                }

                parentElement.appendChild(pElement); // ここで直接親要素に追加
            });
        }

    } else if (item.type === "list") {
        element = document.createElement(item.ordered ? "ol" : "ul");

        item.items.forEach(listItem => {
            const li = document.createElement("li");

            if (typeof listItem === "string") {
                li.textContent = listItem;
            } else if (typeof listItem === "object") {
                if ("text" in listItem) {
                    const strong = document.createElement("strong");
                    strong.textContent = listItem.text;
                    li.appendChild(strong);
                }
                if ("details" in listItem) {
                    const details = document.createElement("p");
                    details.textContent = listItem.details;
                    li.appendChild(details);
                }
                if ("sample" in listItem) {
                    const sample = document.createElement("p");
                    sample.style.fontStyle = "italic";
                    sample.textContent = `例: ${listItem.sample}`;
                    li.appendChild(sample);
                }
            }

            element.appendChild(li);
        });
    } else if (item.type === "code") {
        element = document.createElement("pre");
        const code = document.createElement("code");
        code.classList.add(item.language || "plaintext");
        code.textContent = item.content;
        element.appendChild(code);
    } else if (item.type === "table") {
        element = document.createElement("table");
        element.classList.add("content-table"); // 📌 スタイル適用

        
        // ヘッダー行
        if (Array.isArray(item.headers)) {
            const thead = document.createElement("thead");
            const tr = document.createElement("tr");
            item.headers.forEach(headerText => {
                const th = document.createElement("th");
                th.textContent = headerText;
                tr.appendChild(th);
            });
            thead.appendChild(tr);
            element.appendChild(thead);
        }
    
        // ボディ行
        if (Array.isArray(item.rows)) {
            const tbody = document.createElement("tbody");
            item.rows.forEach(rowData => {
                const tr = document.createElement("tr");
                rowData.forEach(cellData => {
                    const td = document.createElement("td");
                    td.textContent = cellData;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            element.appendChild(tbody);
        }
    }    

    if (element) {
        parentElement.appendChild(element);
    }
}


function applyAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === "class") {
            if (typeof value === "string") {
                value.split(" ").forEach(cls => element.classList.add(cls));
            }
        } else if (key === "boldtext") {
            const strong = document.createElement("strong");
            strong.textContent = value;
            element.prepend(strong);
        } else {
            element.setAttribute(key, value);
        }
    });
}


function saveLastViewed(jsonFile) {
    localStorage.setItem("lastViewed", jsonFile);
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromURL = urlParams.get("page");
    const lastViewed = localStorage.getItem("lastViewed");

    if (pageFromURL) {
        loadContent(pageFromURL, false);
    } else if (lastViewed) {
        loadContent(lastViewed, false);
    } else {
        loadContent("data/preface/preface.json", false);
    }
});

window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
        loadContent(event.state.page, false);
    }
});
