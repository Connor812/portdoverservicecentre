export function PostData(type, userData) {
    // const BaseURL = 'https://localhost/md-auto/api/';
    const BaseURL = 'https://portdoverservicecentre.com/api/';

    return fetch(BaseURL + type, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then((response) => {
            if (!response.ok) {
                // Handle server errors (4xx, 5xx)
                throw new Error(`Server error: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error in PostData:", error);
            throw new Error("Network error or server unavailable. Please try again later.");
        });
}
