import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

const InlineSelect = ({
    value,
    onChange,
    options,
    isLoading,
    disabled,
    nonInteractive = false,
    className = "",
    placeholder = "Select..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownUp, setDropdownUp] = useState(false);
    const containerRef = useRef(null);

    const updateDropdownPosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            // If less than 280px below and more space above, open upwards
            if (spaceBelow < 280 && rect.top > spaceBelow) {
                setDropdownUp(true);
            } else {
                setDropdownUp(false);
            }
        }
    };

    const displayValue = options.find(opt =>
        (typeof opt === 'string' ? opt : opt.value) === value
    );

    const label = displayValue
        ? (typeof displayValue === 'string' ? displayValue.replaceAll("_", " ") : displayValue.label)
        : placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
            window.addEventListener('scroll', updateDropdownPosition, true);
            window.addEventListener('resize', updateDropdownPosition);
        }
        return () => {
            window.removeEventListener('scroll', updateDropdownPosition, true);
            window.removeEventListener('resize', updateDropdownPosition);
        };
    }, [isOpen]);

    if (nonInteractive) {
        return (
            <div className={`text-sm py-1 px-3 bg-gray-50 rounded-lg text-gray-700 ${className}`}>
                {label}
            </div>
        );
    }

    return (
        <div className={`relative inline-block w-full min-w-[130px] ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
                disabled={disabled || isLoading}
                className={`
                    flex items-center justify-between w-full px-4 py-2 
                    text-base bg-white border border-gray-200 rounded-xl
                    hover:border-[var(--Yellow)] transition-all duration-200
                    shadow-sm hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                <span className="truncate mr-2 font-medium text-gray-800">
                    {label}
                </span>
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--Yellow)]" />
                ) : (
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400`} />
                )}
            </button>

            {isOpen && (
                <div
                    className={`
                        absolute z-[60] w-full min-w-[180px] bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200 
                        ${dropdownUp ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'}
                    `}
                >
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {options.map((opt) => {
                            const val = typeof opt === 'string' ? opt : opt.value;
                            const optLabel = typeof opt === 'string' ? opt.replaceAll("_", " ") : opt.label;
                            const isSelected = val === value;

                            return (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                        onChange(val);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-5 py-3 text-base transition-colors flex items-center
                                        ${isSelected
                                            ? 'bg-[var(--Yellow)]/10 text-[var(--Main)] font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-black hover:font-medium'}
                                    `}
                                >
                                    {opt.icon && <opt.icon className="h-4 w-4 mr-3" />}
                                    {optLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InlineSelect;
