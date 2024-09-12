// place files you want to import through the `$lib` alias in this folder.

export const fetchDb = async (url, options = {}) => {
	try {
		const response = await fetch(`http://localhost:3000/api/${url}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			...options
		});

		if (!response.ok) {
			console.log('error', response.status, response.statusText);
			return;
		}

		if (response.status === 204) return true;

		const data = await response.json();

		return data;
	} catch (error) {
		console.log('error marking complete', error);
	}
};
