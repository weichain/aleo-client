const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));


export const retry = async <T>(method: () => Promise<T>, startWaitTime = 1500, waitBackoff = 2, retryNumber = 8) => {
    let waitTime = startWaitTime;
    for (let i = 0; i < retryNumber; i++) {
        try {
            const result = await method();
            if (result) {
                return result;
            }
        } catch (err) {
            // throw error on last try
            if (i + 1 == retryNumber) {
                throw err;
            }
        } finally {
            await sleep(waitTime);
            waitTime *= waitBackoff;
        }
    }
    return null;
};