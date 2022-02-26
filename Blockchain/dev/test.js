const Blockchain=require('./blockchain');
const coin=new Blockchain();
// coin.createblock(100,'qwqwqwqwqwqqwww','wwssaaeerrwwqqffddf');
// coin.createnewtransaction(10000000,'darshit','meet');
// coin.createnewtransaction(10000000,'darshit','meet');
// coin.createblock(100,'ddeeeddddeeeddwwqq','asasqwqwzxzxcderfvtgbyhnujm');
// let currenblock=[{ amaount: 10000000, sender: 'darshit', recipient: 'meet' },
// { amaount: 10000000, sender: 'darshit', recipient: 'meet' }];
// let privieshash='qwertyuiopasdfghjklzxcvbnm';
// coin.hashBlock(privieshash,currenblock,19876);
console.log(coin.chainIsValid([
    {
    "index": 1,
    "time": 1644673689876,
    "treansaction": [],
    "privioushash": "0",
    "hash": "0",
    "nonce": 100
    },
    {
    "index": 2,
    "time": 1644673709338,
    "treansaction": [
    {
    "amaount": "50000",
    "sender": "darshit",
    "recipient": "ashokbhai",
    "transactionid": "888e0ac826e344fa82b6bfff1cb48080"
    }
    ],
    "privioushash": "0",
    "hash": "0000876094ff2b0d4b8876f278078ced388ee5dce2f376029a6317c356f437c9",
    "nonce": 62843
    }
    ]));