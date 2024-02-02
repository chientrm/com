import { env } from '$env/dynamic/private';
import { audience, issuer } from '$lib/constants/string';
import { SignJWT, importPKCS8, type JWTPayload } from 'jose';

const forPrivateKey = importPKCS8(env.PKCS8, 'RS512');

export const sign = async <T extends JWTPayload>(data: T) =>
  new SignJWT(data)
    .setProtectedHeader({ alg: 'RS512' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime('1w')
    .sign(await forPrivateKey);
