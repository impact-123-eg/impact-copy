import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import '../select2-custom.css';

// 1. Assign jQuery global
window.jQuery = window.$ = $;

console.log("jQuery version:", $.fn.jquery);

const initSelect2 = ($el) => {
    if ($el.hasClass('select2-hidden-accessible')) {
        return; // Already initialized
    }
    // Skip elements that opt-out of Select2 (for Formik/React controlled selects)
    if ($el.attr('data-no-select2') === 'true') {
        console.log("Skipping Select2 for element with data-no-select2:", $el[0]);
        return;
    }
    console.log("Found raw <select> element, applying Select2:", $el[0]);
    try {
        $el.select2({
            width: '100%',
            placeholder: $el.attr('placeholder') || "Select...",
            allowClear: true
        });
        console.log("✅ Select2 applied successfully to:", $el[0]);
    } catch (err) {
        console.error("❌ Failed to apply Select2:", err);
    }
};

const startObserver = () => {
    // 1. Initialize on existing selects
    console.log("Document ready, scanning for <select> options...");
    $('select').each(function () {
        initSelect2($(this));
    });

    // 2. Observer for dynamically added selects (React)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'SELECT') {
                            initSelect2($(node));
                        }
                        // Check children
                        const selects = $(node).find('select');
                        selects.each(function () {
                            initSelect2($(this));
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    console.log("👀 Global Select2 Observer started");
};

// 2. Load Select2 dynamically AFTER global assignment
(async () => {
    // try {
    //     const select2Module = await import('select2');
    //     console.log("Select2 module loaded:", select2Module);

    //     // Check if it's a factory function (common in some UMD builds imported dynamically)
    //     if (typeof select2Module.default === 'function') {
    //         console.log("Applying Select2 factory to global jQuery...");
    //         select2Module.default(window.jQuery);
    //     }

    //     // Double check if $.fn.select2 is now available
    //     if (typeof window.jQuery.fn.select2 !== 'undefined') {
    //         console.log("✅ Select2 successfully attached to jQuery");
    //         // Start logic
    //         if (document.readyState === 'loading') {
    //             document.addEventListener('DOMContentLoaded', startObserver);
    //         } else {
    //             startObserver();
    //         }
    //     } else {
    //         // Fallback: sometimes the import itself did the side effect but looking for 'jquery' module
    //         // If we are here, it means it failed.
    //         // Try to see if it attached to a different jquery instance?
    //         // Unlikely since we only have one.
    //         console.error("❌ Select2 loaded but $.fn.select2 is still undefined. Factory failed or not a factory.");
    //     }
    // } catch (e) {
    //     console.error("❌ Failed to load Select2 dynamically:", e);
    // }
})();

