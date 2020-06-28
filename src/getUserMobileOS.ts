export const getUserMobileOS = (): string[] => {
    type MobileOSRegEx = { [key: string ]: string | RegExp }
    type MobileOSRegExFixed = { [key: string ]: RegExp };

    const oss = {
        'AndroidOS': 'Android',
        'iOS': '\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia',
        'iPadOS': 'CPU OS 13',
    };

    /**
     * Cut agent string.
     * @param userAgent
     */
    const prepareUserAgent = (userAgent: string): string => {
        return (userAgent || '').substr(0, 500);
    };

    /**
     * Get fixed regex.
     * @param oss
     */
    const getConvertedPropsToRegExp = (oss: MobileOSRegEx ): MobileOSRegExFixed => {
        const newOSs: MobileOSRegExFixed = {};

        let key: keyof MobileOSRegEx;
        for (key in oss) {
            if (oss.hasOwnProperty(key)) {
                newOSs[key] = new RegExp(oss[key], 'i');
            }
        }

        return newOSs;
    }

    /**
     * Find matches in agent for rules.
     * @param rules
     * @param userAgent
     */
    const findMatch = (rules: MobileOSRegExFixed, userAgent: string) => {
        const result = [];
        for (const key in rules) {
            if (Object.hasOwnProperty.call(rules, key)) {
                if (rules[key].test(userAgent)) {
                    result.push(key);
                }
            }
        }
        return result;
    };

    return findMatch(
        getConvertedPropsToRegExp(oss),
        prepareUserAgent(window.navigator.userAgent)
    );
};
