import NodeRSA from 'node-rsa';
import { createAppAuth } from '@octokit/auth-app';
import { request } from '@octokit/request';

import readFileContents from './util/readFileContents';
import { Authentication } from '@octokit/auth-app/dist-types/types';
import { AuthInterface } from '@octokit/types';

export default async function (
  appId: number,
  installationId: number,
  clientId: string,
  clientSecret: string,
  privateKeyPath: string,
  gitHubUrl: string,
): Promise<AuthInterface<never[], Authentication>> {
  const privateKeyPkcs1 = await readFileContents(privateKeyPath);
  const key = new NodeRSA(privateKeyPkcs1);
  const privateKey = key.exportKey('pkcs8-private-pem');
  // Retrieve JSON Web Token (JWT) to authenticate as app
  return createAppAuth({
    appId,
    privateKey,
    installationId,
    clientId,
    clientSecret,
    request: request.defaults({ baseUrl: gitHubUrl }),
  });
}
