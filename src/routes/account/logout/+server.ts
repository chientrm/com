import { logout } from '$lib/helpers/auth';
import { redirect } from '@sveltejs/kit';

export const GET = ({ cookies }) => {
  logout(cookies);
  throw redirect(303, '/');
};
