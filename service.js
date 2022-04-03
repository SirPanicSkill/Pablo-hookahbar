export class AppService {
    constructor() {}

    async get(url, isResponseBlob) {
        let response = await fetch(url);

        if (response.ok) {
            let data = isResponseBlob ? await response.blob() : await response.json();

            return data;
        } else {
            console.error('HTTP error: ' + response.status);
        };
    }
}