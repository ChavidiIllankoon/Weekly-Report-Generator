const mongoose = require('mongoose');

// We will try connecting without replicaSet first to see if Mongoose auto-detects it.
// Mongoose / MongoDB NodeJS driver is smart and usually resolves replica set from the seed list automatically!
const uris = [
  'mongodb://Chavidi:Chavidi13@ac-hreling-shard-00-00.vtwv293.mongodb.net:27017,ac-hreling-shard-00-01.vtwv293.mongodb.net:27017,ac-hreling-shard-00-02.vtwv293.mongodb.net:27017/reportGen?ssl=true&authSource=admin&retryWrites=true&w=majority',
  'mongodb://Chavidi:Chavidi13@ac-hreling-shard-00-00.vtwv293.mongodb.net:27017,ac-hreling-shard-00-01.vtwv293.mongodb.net:27017,ac-hreling-shard-00-02.vtwv293.mongodb.net:27017/reportGen?ssl=true&replicaSet=atlas-vtwv29-shard-0&authSource=admin&retryWrites=true&w=majority'
];

async function test() {
  for (const uri of uris) {
    console.log(`Trying connection to: ${uri.replace(/:[^@]+@/, ':****@')}`);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected successfully!');
      console.log('Use this exact connection string!');
      process.exit(0);
    } catch (err) {
      console.error('❌ Failed:', err.message);
    }
  }
  process.exit(1);
}

test();
