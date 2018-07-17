import Promise from 'bluebird';
import nconf from 'nconf';
import R from 'ramda';
import _request from 'request';

import T from '../../translate';

const request = Promise.promisify(_request);

function issueCommand(client, evt, suffix, lang) {
  if (!nconf.get('PARSEC_KEY') || !nconf.get("PARSEC_BOT_URL")) return Promise.resolve(T('parsec_setup', lang));
  const split_suffix = suffix.split(' ');
  const cmd = split_suffix[0];

  const options = {
    url: nconf.get("PARSEC_BOT_URL"),
    method: 'GET',
    json: {
      key: nconf.get('PARSEC_KEY'),
      discord_user_id: evt.message.author.id,
      cmd: cmd
    }
  };

  return request(options).then(response => {
    const code = response.statusCode,
          body = response.body || {};
    var msg = body.msg;

    if (code !== 200) {
      if (!msg) {
        msg = body.err || body.error;
      }
      if (!msg) {
        msg = "there was an error when communicating with Parsec. Please try again later";
      }
    }
    return msg;
  });
}

export default {
  parsec: issueCommand,
};

export const help = {
  parsec: {
    prefix: false,
    subcommands: [
      {
        name: "me"
      },
      {
        name: "start"
      },
      {
        stop: "stop"
      }
    ]
  }
};
