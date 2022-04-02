export class AppService {
    constructor() {}

    async get(url) {
        let response = await fetch(url, {
            headers: {
                accept: "application/json"
            }
        });

        if (response.ok) {
            let json = await response.json();
            let data = json.d;

            return data;
        } else {
            console.error('HTTP error: ' + response.status);
        };
    }
}