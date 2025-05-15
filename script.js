document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const downloadPdfButton = document.getElementById('download-pdf');
    const pageNumberDisplay = document.getElementById('page-number');
    const tocLinks = document.querySelectorAll('.toc a');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    function showSlide(index, direction = 'next') {
        if (index < 0 || index >= totalSlides) return;

        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'previous');
            if (i === currentSlideIndex && i !== index) { // 現在のスライドで、移動先ではない場合
                if (direction === 'next') {
                    // slide.classList.add('previous'); // 次へ進む際、現在のは左に消えるアニメーション（CSSで制御）
                } else {
                    // 前へ戻る際のアニメーションはCSSで制御
                }
            }
        });
        
        slides[index].classList.add('active');
        if (direction === 'prev') {
            slides[index].classList.remove('previous'); // 前に戻る場合は previous クラスは不要
        }


        currentSlideIndex = index;
        updatePageNumber();
        updateNavButtons();
        // Update URL hash for deep linking (optional)
        // history.pushState(null, null, `#${slides[index].id || 'slide-' + index}`);
    }

    function updatePageNumber() {
        pageNumberDisplay.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
    }

    function updateNavButtons() {
        prevButton.disabled = currentSlideIndex === 0;
        nextButton.disabled = currentSlideIndex === totalSlides - 1;
    }

    prevButton.addEventListener('click', () => {
        showSlide(currentSlideIndex - 1, 'prev');
    });

    nextButton.addEventListener('click', () => {
        showSlide(currentSlideIndex + 1, 'next');
    });

    downloadPdfButton.addEventListener('click', () => {
        alert("プレゼンテーションをPDFとして保存します。\nブラウザの印刷ダイアログが表示されたら、「PDFとして保存」または「Microsoft Print to PDF」などを選択してください。");
        
        // 印刷用に一時的に全スライドを表示するスタイルを適用（CSS @media print で対応が理想）
        // const slidesWrapper = document.querySelector('.slides-wrapper');
        // slidesWrapper.classList.add('printing'); // このクラスで全スライド表示を制御
        
        window.print();

        // slidesWrapper.classList.remove('printing'); // 印刷後元に戻す
    });

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return; // 入力中はスライド操作を無効化
        }
        if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
            if (currentSlideIndex < totalSlides - 1) {
                 nextButton.click();
            }
            event.preventDefault();
        } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            if (currentSlideIndex > 0) {
                prevButton.click();
            }
            event.preventDefault();
        } else if (event.key === 'Home') {
            showSlide(0);
            event.preventDefault();
        } else if (event.key === 'End') {
            showSlide(totalSlides - 1);
            event.preventDefault();
        }
    });

    // Table of Contents navigation
    tocLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSlide = document.getElementById(targetId);
            if (targetSlide) {
                const targetIndex = Array.from(slides).indexOf(targetSlide);
                if (targetIndex !== -1) {
                    showSlide(targetIndex);
                }
            }
        });
    });
    
    // Initial setup
    if (totalSlides > 0) {
        // Check for hash in URL to go to a specific slide
        const initialHash = window.location.hash.substring(1);
        let initialSlideIndex = 0;
        if (initialHash) {
            const targetSlideByHash = document.getElementById(initialHash);
            if (targetSlideByHash) {
                const foundIndex = Array.from(slides).indexOf(targetSlideByHash);
                if (foundIndex !== -1) {
                    initialSlideIndex = foundIndex;
                }
            }
        }
        showSlide(initialSlideIndex);
    } else {
        pageNumberDisplay.textContent = "0 / 0";
        prevButton.disabled = true;
        nextButton.disabled = true;
    }
});
