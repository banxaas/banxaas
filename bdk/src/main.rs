use bdk::bitcoin::Network;
use bdk::blockchain::ElectrumBlockchain;
use bdk::electrum_client::Client;
use bdk::database::MemoryDatabase;
use bdk::Wallet;
use bdk::SyncOptions;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let external_descriptor = "wpkh([08f0f3e6/84h/0h/0h]xpub6Csr3sdoLdqURBkYtbcco59pvQUC1HLRy3STK3Mohqd5BH343vtrtn3jbCu3htL1ouMChN6wC3iRYxdwUSjWaKZCgd4KxQxiVesPFJh2dzb/0/*)";
    let internal_descriptor = "wpkh([08f0f3e6/84h/0h/0h]xpub6Csr3sdoLdqURBkYtbcco59pvQUC1HLRy3STK3Mohqd5BH343vtrtn3jbCu3htL1ouMChN6wC3iRYxdwUSjWaKZCgd4KxQxiVesPFJh2dzb/1/*)";

    let blockchain =  ElectrumBlockchain::from(Client::new("tcp://electrum.banxaas.com:50001").unwrap());

    let wallet: Wallet<MemoryDatabase> = Wallet::new(
        external_descriptor,
        Some(internal_descriptor),
        Network::Bitcoin,
        MemoryDatabase::default(),
    )?;

    // ...

    wallet.sync(&blockchain, SyncOptions::default())?;

     Ok(())

}