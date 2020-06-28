import * as React from 'react';

/**
 * Class for password input with masked letters and delay fading.
 */
class MaskedPassword {
    pattern: string;
    delay: number = 600;
    realText: string = '';
    timeoutID?: number;

    /**
     * constructor;
     * @param {String} pattern [pattern string]
     * @param {int} delay [delay time (ms)]
     */
    constructor(pattern: string, delay: number) {
        this.pattern = pattern;
        this.delay = delay;
    }

    /**
     * Get string with masked letters.
     * @param pattern
     * @param length
     */
    getMaskedString = (pattern: string, length: number) => {
        return Array.apply(null, Array(length)).map(function() {
            return pattern;
        }).join('');
    };

    /**
     * Set masked value to the field.
     * @param element
     */
    setMaskedValue = (element: HTMLInputElement) => {
        element.value = this.getMaskedString(this.pattern, element.value.length);
    };

    /**
     * Field keyboard input handler.
     * @param e
     */
    handleKeyboardInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const prevValue = this.realText;
        const nowValue = target.value;
        const index = target.selectionStart === null ? 0 : target.selectionStart; // check cursor position
        const valuesDiff = nowValue.length - prevValue.length;

        if (valuesDiff > 0) {
            const newText = nowValue.slice(index - valuesDiff, index);
            this.realText = prevValue.slice(0, index - valuesDiff) + newText + prevValue.slice(index - valuesDiff);
        } else if (valuesDiff < 0) {
            this.realText = prevValue.slice(0, index) + prevValue.slice(index - valuesDiff);
        }

        if (nowValue.length > 0) {
            target.value = this.getMaskedString(this.pattern, nowValue.length - 1) + nowValue.charAt(nowValue.length - 1);
            this.start(this.setMaskedValue.bind(this), target, this.delay);
        }

        target.setSelectionRange(index, index); // reset cursor location
    };

    /**
     * Execute masking with fading.
     * @param maskedFunc
     * @param arg
     */
    serveFading = (maskedFunc: (element: HTMLInputElement) => void, arg: HTMLInputElement) => {
        maskedFunc(arg);
        delete this.timeoutID;
    }

    /**
     * Start masked fading for current inputted letter.
     * @param maskedFunc
     * @param arg
     * @param delay
     */
    start = (maskedFunc: (element: HTMLInputElement) => void, arg: HTMLInputElement, delay: number) => {
        this.cancel();
        this.timeoutID = window.setTimeout(() => { this.serveFading(maskedFunc, arg); }, delay);
    }

    /**
     * Cancel fading timeout for previous letter.
     */
    cancel = () => {
        if (this.timeoutID) {
            window.clearTimeout(this.timeoutID);
            delete this.timeoutID;
        }
    }
}

export default MaskedPassword;
