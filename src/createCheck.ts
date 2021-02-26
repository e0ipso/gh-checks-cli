import { request } from '@octokit/request';
import {
  Authentication,
  RequestParameters,
} from '@octokit/auth-app/dist-types/types';
import { OctokitResponse, AuthInterface } from '@octokit/types';
import Debug from 'debug';

const debug = Debug('gh-checks');

type CheckPayloadOutputImage = {
  alt: string;
  image_url: string;
  caption?: string;
  actions?: Array<{
    label: string;
    identifier: string;
    description: string;
  }>;
};

type CheckPayloadOutputAnnotation = {
  path: string;
  start_line: number;
  end_line: number;
  start_column?: number;
  end_column?: number;
  annotation_level: 'notice' | 'warning' | 'failure';
  message: string;
  title?: string;
  raw_details: string;
};

type CheckPayloadOutput = {
  title: string;
  summary: string;
  text?: string;
  annotations?: Array<CheckPayloadOutputAnnotation>;
  images?: Array<CheckPayloadOutputImage>;
};

type CheckPayload = RequestParameters & { status?: 'completed' | undefined } & {
  status?: 'queued' | 'in_progress' | undefined;
} & {
  name: string;
  head_sha: string;
  details_url?: string;
  external_id?: string;
  started_at?: string;
  conclusion?: string;
  completed_at?: string;
  output?: CheckPayloadOutput;
};

export default async function (
  auth: AuthInterface<any[], Authentication>,
  ghUrl: string,
  owner: string,
  repo: string,
  commitHash: string,
  payload: CheckPayload,
): Promise<OctokitResponse<any>> {
  const authedRequestToGH = request.defaults({
    request: {
      hook: auth.hook,
    },
    headers: { accept: 'application/vnd.github.antiope-preview+json' },
    mediaType: {
      previews: ['machine-man'],
    },
    baseUrl: ghUrl,
  });
  try {
    const result = await authedRequestToGH(
      'POST /repos/{owner}/{repo}/check-runs',
      {
        owner,
        repo,
        ...payload,
        head_sha: commitHash,
      },
    );
    return result;
  } catch (exception) {
    debug(exception);
    return exception;
  }
}
