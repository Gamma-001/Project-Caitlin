const { Extendable } = require('klasa');
const { Client } = require('discord.js');
const {Client:PG_Client} = require('pg');

const pg_client = new PG_Client({
   connectionString: process.env.DATABASE_URL,
   ssl: true
});

module.exports = class extends Extendable {
   constructor(...args) {
      super(...args, {
         appliesTo: [Client]
      });
      pg_client.connect();
   }
   get pg_client() {
      return pg_client;
   }
};