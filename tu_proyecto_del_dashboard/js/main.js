document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tabs-list .tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabsContainer = document.querySelector('.tabs-container');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Do not allow switching tabs when in edit mode.
                // The 'is-editing' class is added to the tabsContainer.
                if (tabsContainer && tabsContainer.classList.contains('is-editing')) {
                    return;
                }

                // Deactivate all tabs
                tabButtons.forEach(btn => {
                    btn.classList.remove('is-active');
                    btn.setAttribute('aria-selected', 'false');
                });

                // Deactivate all tab contents
                tabContents.forEach(content => {
                    content.classList.remove('is-active');
                });

                // Activate the clicked tab and its content
                button.classList.add('is-active');
                button.setAttribute('aria-selected', 'true');
                const contentId = button.getAttribute('aria-controls');
                const activeContent = document.getElementById(contentId);
                if (activeContent) {
                    activeContent.classList.add('is-active');
                }
            });
        });
    }
});