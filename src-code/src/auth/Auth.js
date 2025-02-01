export function Authentication() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (!userData) {
        return {
            status: false,
            message: "Not_Logged_In"
        };
    }

    const timestamp = userData.timestamp;
    const currentTime = new Date();
    const timestampDate = new Date(timestamp);
    const timeDifference = currentTime - timestampDate;
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursDifference >= 5) {
        sessionStorage.removeItem('userData');
        return {
            status: false,
            message: "Session_Expired"
        };
    }

    return {
        status: true,
        message: "Logged_In"
    };
}