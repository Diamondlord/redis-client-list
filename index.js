#!/usr/bin/env node

const yargs = require('yargs/yargs');
const Redis = require('ioredis');
const util = require('util');

// Parse args
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 -h [str] -p [num]')
  .describe('h', 'Host')
  .alias('h', 'host')
  .default('h', 'localhost')
  .describe('p', 'Port')
  .alias('p', 'port')
  .default('p', 6379)
  .argv;

console.log(`Connecting to host ${argv.host} and port ${argv.port}`);

const redis = new Redis({
  host: argv.host, // Redis host
  port: argv.port, // Redis port
});

const TYPES = ['normal', 'pubsub', 'master', 'replica'];

const promises = [];

TYPES.forEach(type => {
  const promise = getClients(type)
    .catch(err => {
      console.log('err:', err);
    });
  promises.push(promise);
})

async function getClients(type = 'normal') {
  const result = await redis['client']('list', 'type', type);
  const uniqueIps = parseIps(result);
  console.log(type, util.inspect(uniqueIps, { maxArrayLength: null }))
}

function parseIps(result) {
  const connectionList = result.split('\n').filter(con => con);

  const ips = connectionList.map(con => {
    const address = con.split(' ')[1];
    const [ip, port] = address.split('=')[1].split(':');
    return ip;
  });
  const uniqueIps = [... new Set(ips)];
  return uniqueIps;
}

Promise.all(promises)
  .then( () => {
      redis.quit();
    });
