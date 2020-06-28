import * as React from 'react';
import MaskedPassword from './maskedPassword';
import usePrevious from './usePrevious';
import { getUserMobileOS } from './getUserMobileOS';

type Props = {
    onPasswordChange?: (value: string) => void,
    inputRef?: React.RefObject<HTMLInputElement>,
    pattern?: string,
    nameSuffix?: string,
    letterFadeDuration?: number,
} & React.HTMLProps<HTMLInputElement>;

const InputPassword: React.FC<Props> = (
    {
        pattern = '•',
        nameSuffix = '__masked',
        inputRef = React.createRef<HTMLInputElement>(),
        onPasswordChange,
        onChange,
        type= 'password',
        name= 'password',
        autoComplete,
        letterFadeDuration = 600,
        ...rest
    },
) => {
    const [isMobileOS, setMobileOS] = React.useState<boolean>(false);
    const hiddenInputRef = React.useRef<HTMLInputElement>(null);
    const maskedPasswordRef = React.useRef<MaskedPassword>(new MaskedPassword(pattern, letterFadeDuration));
    const prevType = usePrevious<string | undefined>(type);

    React.useEffect(() => {
        const oss = getUserMobileOS();

        if (oss.includes('AndroidOS')
            || oss.includes('iOS')
            || oss.includes('iPadOS')) {
            setMobileOS(true);
        }
    }, [])

    React.useEffect(() => {
        if (!inputRef.current || isMobileOS) {
            return;
        }

        if (type === 'text' && prevType === 'password') {
            inputRef.current.value = maskedPasswordRef.current.realText;
            maskedPasswordRef.current.cancel();
        }

        if (type === 'password' && prevType === 'text') {
            maskedPasswordRef.current.realText = inputRef.current.value;

            inputRef.current.value = maskedPasswordRef.current.getMaskedString(
                pattern,
                maskedPasswordRef.current.realText.length
            );
        }

    }, [type, isMobileOS]);

    /**
     * Handle hidden input change.
     * @param e
     * @private
     */
    const _onHiddenInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).value;

        if (inputRef && inputRef.current) {
            inputRef.current.value = maskedPasswordRef.current.getMaskedString(pattern, value.length);

            if (onPasswordChange) {
                onPasswordChange(value);
            }

            maskedPasswordRef.current.realText = value;
        }
    };

    /**
     * Handle visible input change.
     * @param e
     * @private
     */
    const _onChange = (e: React.FormEvent<HTMLInputElement>): void => {
        if (!hiddenInputRef || !hiddenInputRef.current) {

            if (onPasswordChange) {
                onPasswordChange((e.target as HTMLInputElement).value);
            }

            if (onChange) {
                onChange(e);
            }

            return;
        }

        if (inputRef && inputRef.current) {
            const passwordValue = type === 'password' ?
                maskedPasswordRef.current.realText
                :
                inputRef.current.value

            if (onPasswordChange) {
                onPasswordChange(passwordValue);
            }

            if (hiddenInputRef && hiddenInputRef.current) {
                hiddenInputRef.current.value = passwordValue;
            }
        }

        if (onChange) {
            onChange(e);
        }
    }

    if (isMobileOS) {
        return (
            <input
                ref={inputRef}
                onChange={_onChange}
                type={type}
                name={name}
                autoComplete={autoComplete}

                {...rest}
            />
        )
    }

    return (
        <>
            <input
                style={{
                    position: 'fixed',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                }}
                tabIndex={-1}
                ref={hiddenInputRef}
                name={name}
                type={'password'}
                onChange={_onHiddenInputChange}
                autoComplete={autoComplete}
            />
            <input
                ref={inputRef}
                onChange={_onChange}
                type={'text'}
                name={name + nameSuffix}
                autoComplete={autoComplete}
                onInput={(type === 'password') ?
                    maskedPasswordRef.current.handleKeyboardInput.bind(maskedPasswordRef.current)
                    :
                    undefined}

                {...rest}
            />
        </>
    )
};

export default InputPassword;