import { users } from '$lib/db';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        // Validate input
        if (!username || !password) {
            return { success: false, error: 'Username and password are required.' };
        }

        // Insert user into the database
        await users.insertAsync({ _id: username, password, createdAt: new Date() });

        return { success: true };
    }
};
