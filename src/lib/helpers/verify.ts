import { PUBLIC_SPKI } from '$env/static/public';
import { audience, issuer } from '$lib/constants/string';
import { importSPKI, jwtVerify } from 'jose';

const forPublicKey = importSPKI(PUBLIC_SPKI, 'RS512');

export const verify = async <T>(jwt: string) =>
  jwtVerify(jwt, await forPublicKey, { issuer, audience }).then(
    (result) => result.payload as T
  );
