const dns = require('dns');

const srvRecord = '_mongodb._tcp.reportgen.vtwv293.mongodb.net';

console.log('Resolving system DNS for SRV record...');
dns.resolveSrv(srvRecord, (err, addresses) => {
  if (err) {
    console.error('System DNS resolveSrv Error:', err.message);
    
    // Now try Google DNS
    console.log('\nTrying Google DNS (8.8.8.8)...');
    const resolver = new dns.Resolver();
    resolver.setServers(['8.8.8.8']);
    resolver.resolveSrv(srvRecord, (gErr, gAddresses) => {
      if (gErr) {
        console.error('Google DNS resolveSrv Error:', gErr.message);
      } else {
        console.log('✅ Resolved addresses via Google DNS:', gAddresses);
        generateConnectionString(gAddresses);
      }
    });
  } else {
    console.log('✅ Resolved addresses via System DNS:', addresses);
    generateConnectionString(addresses);
  }
});

function generateConnectionString(addresses) {
  const hosts = addresses.map(addr => `${addr.name}:${addr.port}`).join(',');
  console.log('\n----------------------------------------');
  console.log('Use this fallback connection string in your .env (replace username/password/database):');
  console.log(`MONGO_URI=mongodb://Chavidi:Chavidi13@${hosts}/?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority`);
  console.log('----------------------------------------');
}
