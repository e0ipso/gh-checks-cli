import { Command } from 'commander';
import Debug from 'debug';

import setUpAuthentication from './setUpAuthentication';
import createCheck from './createCheck';

const program = new Command('gh-checks');
const debug = Debug(program.name());

program
  .requiredOption('--appId <value>', 'GitHub App ID for authentication.')
  .requiredOption(
    '--installId <value>',
    'GitHub App installation ID for authentication.',
  )
  .requiredOption('--clientId <value>', 'GitHub App client ID.')
  .requiredOption('--clientSecret <value>', 'GitHub App client secret.')
  .requiredOption(
    '--repoOwner <value>',
    'username of the owner of the target repository to post the status check (organization or user).',
  )
  .requiredOption(
    '--repoName <value>',
    'repository name of the target repository to post the status check.',
  )
  .requiredOption(
    '--privateKeyPath <value>',
    'path to the filesystem where the secret generated private key is saved.',
  )
  .requiredOption(
    '--commitHash <value>',
    'SHA hash of the commit that this status check applies to. All pull requests (and more) that point to this SHA will receive this status check.',
  )
  .requiredOption(
    '-d, --data <value>',
    'JSON encoded string to post to the status check.',
  )
  .option(
    '--gitHubUrl <value>',
    'url for the GitHub REST API. Useful when dealing with GitHub Enterprise',
    'https://api.github.com/api/v3',
  );

const { argv, exit } = process;
program.parse(argv);
const options = program.opts();

(async () => {
  debug('Preparing authentication.');
  const authentication = await setUpAuthentication(
    parseInt(options.appId, 10),
    parseInt(options.installId, 10),
    options.clientId,
    options.clientSecret,
    options.privateKeyPath,
    options.gitHubUrl,
  );
  debug('Authentication prepared.');
  debug('Starting POST request to the Checks API.');
  const result = await createCheck(
    authentication,
    options.gitHubUrl,
    options.repoOwner,
    options.repoName,
    options.commitHash,
    JSON.parse(options.data),
  );
  debug('Request to the Checks API finished.');
  if (result.status > 399) {
    console.error('Unable to create the status check.');
    exit(1);
  }
  console.log('Status check posted successfully.');
})();
