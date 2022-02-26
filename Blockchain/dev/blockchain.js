const sha256=require('sha256');
const { validate } = require('uuid');
const { v4: uuidv4 }=require('uuid');
const currentNodeUrl=process.argv[4];
function Blockchain(){
    this.chain=[];
    this.pandingtransaction=[];
    this.currentNodeUrl=currentNodeUrl;
    this.newNetworkNode=[];
    this.createblock(100,'0','0');
}

Blockchain.prototype.createblock=function (nonce,privioushash,hash){
    let newblock={
        index:this.chain.length+1,
        time:Date.now(),
        treansaction:this.pandingtransaction,
        privioushash:privioushash,
        hash:hash,
        nonce:nonce,
    }

    this.pandingtransaction=[];
    this.chain.push(newblock);
    return newblock;
}

Blockchain.prototype.getlastblock=function() {return this.chain[this.chain.length-1]};

// Blockchain.prototype.createnewtransaction=function(amaount,sender,recipient){

//     let newtransaction={
//         amaount:amaount,
//         sender:sender,
//         recipient:recipient
//     }
//     this.pandingtransaction.push(newtransaction);
//     return this.getlastblock()['index']+1;
// }



//divide createtransaction and add to panding transaction
Blockchain.prototype.createnewtransaction=function(amaount,sender,recipient){

    let newtransaction={
        amaount:amaount,
        sender:sender,
        recipient:recipient,
        transactionid:uuidv4().split('-').join(''),
    }
    return newtransaction;
}

Blockchain.prototype.addtransactiontopandingtransaction=function(transactionobject){
    this.pandingtransaction.push(transactionobject);
    return this.getlastblock()['index']+1;
} 

Blockchain.prototype.hashBlock=function(privioushash,curentblock,nonce){
    const strdata=`${privioushash}${nonce.toString()}${JSON.stringify(curentblock)}`;
    let hash=sha256(strdata);
    return hash;
}

Blockchain.prototype.proofofwork=function(privioushash,curentblock){
    let nonce=0;
    let hash=this.hashBlock(privioushash,curentblock,nonce);
    while(hash.substring(0,4)!=='0000'){
        nonce=nonce+1;
        hash=this.hashBlock(privioushash,curentblock,nonce);
    }
    return nonce;
}

Blockchain.prototype.chainIsValid=function(blockchai){
    let validchain=true;
    blockchai.map((element,index)=>{
        // 0 index is genicies block so not check
        if(index!==0){
        let currentblock=element;
        let priviesblock=blockchai[index-1];
        //create current block hash
        let hash=this.hashBlock(priviesblock.hash,{treansaction:currentblock.treansaction,index:currentblock.index},currentblock.nonce);
        //check current hash is valid or not
        if(hash.substring(0,4)!=='0000') validchain=false;
        // check privies hash is valid or not
        if(currentblock.privioushash!==priviesblock.hash) validchain=false;
        
        }
    })
    // find genicis block
    const genicisblock=blockchai[0];
    // check genices block is valid or not
    if(genicisblock.nonce!==100||genicisblock.hash!=='0'||genicisblock.privioushash!=='0') validchain=false;
    return validchain;
}

Blockchain.prototype.block=function(hash){
    let block=null;
    this.chain.map((element,index)=>{
        if(element.hash===hash){
            block=element;
        }
    })
    return block;
}

Blockchain.prototype.transaction=function(transactionid){
    let block=null;
    let transaction=null;
    
    this.chain.map((block,index)=>{
        block.treansaction.map((transactionobj,index)=>{
            if(transactionobj.transactionid===transactionid){
                transaction=transactionobj;
                block=block;
            }
        })
    })
    return {
        block:block,
        transaction:transaction,
    }
}

Blockchain.prototype.addressdata=function(address){
    let amount=null;
    let transaction=[];
    
    this.chain.map((block,index)=>{
        block.treansaction.map((transactionobj,index)=>{
            if(transactionobj.sender===address || transactionobj.recipient===address){
                transaction.push(transactionobj);
            }
            if(transactionobj.sender===address){
                amount=amount-parseFloat(transactionobj.amaount)
            }
            if(transactionobj.recipient===address){
                amount=amount+parseFloat(transactionobj.amaount)
            }
        })
    })
    return {
        amount:amount,
        transaction:transaction,
    }
}
module.exports=Blockchain;