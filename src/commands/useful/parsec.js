import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';


const request = Promise.promisify(_request);

function issueCommand(client, evt, suffix, lang) {
  if (!nconf.get('PARSEC_KEY') || !nconf.get("PARSEC_BOT_URL")) return Promise.resolve("Parsec Key not set up");
  const split_suffix = suffix.split(' ');
  const cmd = split_suffix[0];

  const options = {
    url: nconf.get("PARSEC_BOT_URL"),
    method: 'GET',
    json: {
      discord_user_id: evt.message.author.id,
      cmd: cmd
    }
  };

  return request(options).then(R.prop('msg'), R.prop("error"));
}

export default {
  ping: issueCommand,
  me: issueCommand,
};

export const help = {
  ping: {},
  me: {}
};
