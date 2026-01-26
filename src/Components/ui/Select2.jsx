import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

const Select2 = ({
    children,
    value,
    onChange,
    options,
    placeholder = "Select...",
    disabled = false,
    allowClear = false,
    className = "",
    ...props
}) => {
    const selectRef = useRef(null);

    useEffect(() => {
        const $element = $(selectRef.current);

        // Initialize Select2 with retry mechanism
        const init = (attempts = 0) => {
            if (attempts > 10) {
                console.error("Select2 failed to load after multiple attempts");
                return;
            }

            if (typeof $element.select2 !== 'function') {
                // Select2 not loaded yet, retry
                setTimeout(() => init(attempts + 1), 100);
                return;
            }

            try {
                $element.select2({
                    placeholder: placeholder,
                    allowClear: allowClear,
                    data: options,
                    disabled: disabled,
                    width: '100%'
                });
            } catch (e) {
                console.error("Error initializing select2 on element:", e);
            }

            // Handle change event
            $element.on('change', function (e) {
                const val = $(this).val();
                if (onChange) {
                    onChange(val);
                }
            });
        };

        init();

        // Handle change event
        $element.on('change', function (e) {
            const val = $(this).val();
            if (onChange) {
                onChange(val);
            }
        });

        // Cleanup
        return () => {
            if ($element.data('select2')) {
                $element.select2('destroy');
                $element.off('change');
            }
        };
    }, [placeholder, allowClear, disabled]); // Re-init if these props change significantly

    // Sync value prop
    useEffect(() => {
        const $element = $(selectRef.current);
        if (value !== $element.val()) {
            $element.val(value).trigger('change.select2'); // Triggering change.select2 updates UI without firing user 'change' event loop
        }
    }, [value]);

    // Sync options if passed as children (React re-renders might desync)
    useEffect(() => {
        const $element = $(selectRef.current);
        // If options changed, we might need to notify Select2, 
        // but usually Select2 picks up DOM changes if configured correctly or re-inited.
        // For simple cases, refreshing the value trigger is often enough.
        $element.trigger('change.select2');
    }, [children, options]);

    return (
        <select
            ref={selectRef}
            className={`form-select ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select2;
