document.addEventListener("DOMContentLoaded", function () {
    fetch("data/book.json")
        .then(response => response.json())
        .then(data => {
            console.log("📖 book.json ロード成功:", data);
            generateNavigation(data);
        })
        .catch(error => console.error("⚠ book.json の読み込みに失敗:", error));
});

function generateNavigation(bookData) {
    document.getElementById("site-title").textContent = bookData.title;

    createNavSection("preface-list", bookData.preface, "data/preface/");
    createNavSection("chapter-list", bookData.chapters, "data/chapter/");
    createNavSection("appendix-list", bookData.appendices, "data/appendices/");
    createNavSection("glossary-list", bookData.glossary, "data/glossary/");
    createNavSection("column-list", bookData.columns, "data/columns/");
    createNavSection("sample-list", bookData.samples, "data/sample/");
    createNavSection("task-list", bookData.tasks, "data/tasks/");
    createNavSection("quiz-list", bookData.quiz, "data/quiz/");
}

function createNavSection(containerId, sectionData, basePath) {
    const container = document.getElementById(containerId);
    if (!container || !sectionData) return;

    sectionData.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.title;
        li.dataset.file = basePath + item.file;
        li.addEventListener("click", function () {
            loadContent(this.dataset.file);
        });
        container.appendChild(li);
    });
}
