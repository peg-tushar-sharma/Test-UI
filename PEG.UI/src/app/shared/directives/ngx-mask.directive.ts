import { Directive, Input, OnInit, ElementRef, HostListener } from '@angular/core';


@Directive({
    selector: '[ngxMask]',
})
export class MaskDirective implements OnInit {

    @Input('ngxMask') ngxMask: string;

    private inputElem: HTMLInputElement;
    private _lastMaskedValue = '';

    constructor(
        private el: ElementRef,
    ) { }

    ngOnInit() {
        this.inputElem = this.el.nativeElement;
    }

    @HostListener('input')
    onInput() {
        this.inputElem.value = this._maskValue(this.inputElem.value);
    }

    private _maskValue(val: string): string {
        if (!val || !this.ngxMask || val === this._lastMaskedValue) {
            return val;
        }

        const maskedVal = this._lastMaskedValue =
            valueToFormat(
                val,
                this.ngxMask,
                this._lastMaskedValue.length > val.length,
                this._lastMaskedValue);

        return maskedVal;
    }

}

const _formatToRegExp = {
    '0': /[0-9]/, 'a': /[a-z]/, 'A': /[A-Z]/, 'B': /[a-zA-Z]/,
};

const _allFormatsStr = '(' +
    Object.keys(_formatToRegExp)
        .map(key => _formatToRegExp[key].toString())
        .map(regexStr => regexStr.substr(1, regexStr.length - 2))
        .join('|')
    + ')';

const _allFormatsGlobal = getAllFormatRegexp('g');

/**
 * Apply format to a value string
 *
 * Format can be constructed from next symbols:
 *  - '0': /[0-9]/,
 *  - 'a': /[a-z]/,
 *  - 'A': /[A-Z]/,
 *  - 'B': /[a-zA-Z]/
 *
 * Example: 'AAA-00BB-aaaa'
 * will accept 'COD-12Rt-efww'
 *
 * @param value Current value
 * @param format Format
 * @param goingBack Indicates if change was done by BackSpace
 * @param prevValue Pass to precisely detect formatter chars
 */
function valueToFormat(value: string, format: string, goingBack = false, prevValue?: string): string {

    let maskedValue = '';
    const unmaskedValue = unmaskValue(value);

    const isLastCharFormatter = !getAllFormatRegexp().test(value[value.length - 1]);
    const isPrevLastCharFormatter = prevValue && !getAllFormatRegexp().test(prevValue[prevValue.length - 1]);

    let formatOffset = 0;
    for (let i = 0, maxI = Math.min(unmaskedValue.length, format.length); i < maxI; ++i) {
        const valueChar = unmaskedValue[i];
        let formatChar = format[formatOffset + i];
        let formatRegex = getFormatRegexp(formatChar);

        if (formatChar && !formatRegex) {
            maskedValue += formatChar;
            formatChar = format[++formatOffset + i];
            formatRegex = getFormatRegexp(formatChar);
        }

        if (valueChar && formatRegex) {
            if (formatRegex && formatRegex.test(valueChar)) {
                maskedValue += valueChar;
            } else {
                break;
            }
        }

        const nextFormatChar = format[formatOffset + i + 1];
        const nextFormatRegex = getFormatRegexp(nextFormatChar);
        const isLastIteration = i === maxI - 1;

        if (isLastIteration && nextFormatChar && !nextFormatRegex) {
            if (!isLastCharFormatter && goingBack) {
                if (prevValue && !isPrevLastCharFormatter) {
                    continue;
                }
                maskedValue = maskedValue.substr(0, formatOffset + i);
            } else {
                maskedValue += nextFormatChar;
            }
        }
    }

    return maskedValue;
}

function unmaskValue(value: string): string {
    const unmaskedMathes = value.replace(' ', '').match(_allFormatsGlobal);
    return unmaskedMathes ? unmaskedMathes.join('') : '';
}

function getAllFormatRegexp(flags?: string) {
    return new RegExp(_allFormatsStr, flags);
}

function getFormatRegexp(formatChar: string): RegExp | null {
    return formatChar && _formatToRegExp[formatChar] ? _formatToRegExp[formatChar] : null;
}