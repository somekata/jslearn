document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector("nav");
    const header = document.querySelector("header");
    const mainContent = document.querySelector("main");

    // 📌 ナビゲーションボタンの追加
    const navToggle = document.createElement("button");
    navToggle.id = "nav-toggle";
    navToggle.textContent = "☰ メニュー";
    document.body.appendChild(navToggle);

    // 📌 ナビゲーションの開閉処理
    navToggle.addEventListener("click", function () {
        if (nav.classList.contains("open")) {
            nav.classList.remove("open");
            navToggle.style.left = "10px";

            // 🔹 ナビを閉じたら、ヘッダーの挙動を元に戻す
            setTimeout(() => {
                header.classList.add("hidden");
            }, 1000);
        } else {
            nav.classList.add("open");
            navToggle.style.left = "260px";

            // 🔹 ナビを開いたら、ヘッダーを強制表示
            header.classList.remove("hidden");
        }
    });

    // 📌 ページロード時にヘッダーを一時表示
    setTimeout(() => {
        header.classList.add("hidden");
    }, 2000); // 2秒後に消える

    // 📌 スクロール時のヘッダー動作
    let lastScrollTop = 0;
    window.addEventListener("scroll", function () {
        let currentScroll = window.scrollY;

        if (currentScroll < lastScrollTop) {
            // 🔹 上にスクロールしたらヘッダーを表示
            header.classList.remove("hidden");
        } else {
            // 🔹 下にスクロールしたらヘッダーを隠す
            setTimeout(() => {
                header.classList.add("hidden");
            }, 1000);
        }

        lastScrollTop = currentScroll;
    });

    // 📌 ナビゲーションを閉じたときの動作
    document.addEventListener("click", function (event) {
        if (!nav.contains(event.target) && !navToggle.contains(event.target) && nav.classList.contains("open")) {
            nav.classList.remove("open");
            navToggle.style.left = "10px";
            setTimeout(() => {
                header.classList.add("hidden");
            }, 1000);
        }
    });
});
