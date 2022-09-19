//use std::io;
use std::env;
use bdk::bitcoin::Network;
use bdk::blockchain::ElectrumBlockchain;
use bdk::blockchain::Blockchain;
use bdk::electrum_client::Client;
use bdk::database::MemoryDatabase;
use bdk::Wallet;
use std::error::Error;
use bdk::FeeRate;
use bdk::SignOptions;
use bdk::SyncOptions;
use std::str::FromStr;
use bitcoin::util::address::Address;


fn main() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();

    let signer_external_descriptor = "wpkh([08f0f3e6/84'/0'/0']xprv9ytVeN6uWGHBChg5na5cRwD6NNdhbpcabpWrWexC9W66JUhuWPacLyjFjvDG2FrHeSk7Fcgsagd1HPLMA83ftadX4qVfz2EdcDAEs8imHgJ/0/*)";

    let wallet_external_descriptor = "wpkh([08f0f3e6/84h/0h/0h]xpub6Csr3sdoLdqURBkYtbcco59pvQUC1HLRy3STK3Mohqd5BH343vtrtn3jbCu3htL1ouMChN6wC3iRYxdwUSjWaKZCgd4KxQxiVesPFJh2dzb/0/*)";
    let wallet_internal_descriptor = "wpkh([08f0f3e6/84h/0h/0h]xpub6Csr3sdoLdqURBkYtbcco59pvQUC1HLRy3STK3Mohqd5BH343vtrtn3jbCu3htL1ouMChN6wC3iRYxdwUSjWaKZCgd4KxQxiVesPFJh2dzb/1/*)";

    let blockchain =  ElectrumBlockchain::from(Client::new("tcp://electrum.banxaas.com:50001").unwrap());
    
    let wallet: Wallet<MemoryDatabase> = Wallet::new(
        wallet_external_descriptor,
        Some(wallet_internal_descriptor),
        Network::Bitcoin,
        MemoryDatabase::default(),
    )?;

    let signer: Wallet<MemoryDatabase> = Wallet::new(
        signer_external_descriptor,
        None,
        Network::Bitcoin,
        MemoryDatabase::default(),
    )?;

    wallet.sync(&blockchain, SyncOptions::default())?;

    let balance = wallet.get_balance()?;
    println!("new_balance: {},", balance);

    //Create the transaction
  let address = &args[1];
  let amount = &args[2];

  let sats: u64 = amount.parse().unwrap();

  let dest = Address::from_str(&address).unwrap();
    let (mut psbt, details) = {
        let mut builder =  wallet.build_tx();
        builder
            .add_recipient(dest.script_pubkey(), sats)
            .enable_rbf()
            //.do_not_spend_change()
            .fee_rate(FeeRate::from_sat_per_vb(5.0));
            
        builder.finish()?
    };

    println!("{:#?},", details);
    println!("unsigned_psbt: {},", psbt.to_string());


    // Sign the transaction
    let finalized = signer.sign(&mut psbt, SignOptions::default())?;
    //assert!(finalized, "Tx not finalized");
    println!("transaction_has_been_signed: {}", finalized);


    // Broadcast the transaction

    let raw_transaction = psbt.extract_tx();

    let txid = raw_transaction.txid();

    blockchain.broadcast(&raw_transaction)?;

    println!(
          "===> Transaction sent! TXID: {txid}.\nExplorer URL: https://mempool.space/tx/{txid}", txid = txid
   );

   Ok(())

}