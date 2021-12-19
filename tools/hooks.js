import { useState } from 'react';
export default {
    useRequestState
}

function useRequestState() {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState()
    const sendRequest = (action, success, errorMessage) => {
        setPending(true)
        setError(undefined)
        action().then((result) => {
            if (success) success(result)
            setPending(false)
        }).catch(error => {
            setPending(false)
            setError(errorMessage || error)
        })
    }
    const clearError = () => setError(undefined)
    return { sendRequest, pending, error, clearError };
}