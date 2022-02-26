const Blockchain=require('../dev/blockchain');
const { v4: uuidv4 }=require('uuid');
let currentaddress=uuidv4().split('-').join('');
const coin=new Blockchain();
const rp=require('request-promise');
const axios = require('axios');
exports.blockchain=(req,res)=>{
    res.json({
        status:1,
        message:"sucess fully get full chain",
        chain:coin,
    })
};

exports.createblock=(req,res)=>{
    let lassblock=coin.getlastblock();
    let previeshash=lassblock.hash;
    let currentblock={
        treansaction:coin.pandingtransaction,
        index:lassblock.index+1
    }
    let  promisestransaction=[];
    let nonce=coin.proofofwork(previeshash,currentblock);
    let currenthsah=coin.hashBlock(previeshash,currentblock,nonce);
    
    let block=coin.createblock(nonce,previeshash,currenthsah);
console.log(block,"block");
    //brodcast node in network
    coin.newNetworkNode.map((element,index)=>{
        let option={
            url:element + 'recive-new-block',
            method: 'post',
            data:block,
        }
        promisestransaction.push(axios(option));
    })
    
    Promise.all(promisestransaction).then((value)=>{

        // reward transaction 
        let option={
            url:coin.currentNodeUrl + 'newtransaction',
            method: 'post',
            data: {
                amount: 12.5,
                sender: "owner",
                resiption: currentaddress,
            },
        }
        return axios(option)

        
    }).then((value)=>{
        res.json({
            status:1,
            message:"create new block sucessfully",
            
        })
    })
   
};



//ragister block in all network

exports.recivenewblock=(req,res)=>{
    let newblock=req.body;
    let lastblock=coin.getlastblock();
    console.log(newblock);
    if(lastblock.hash===newblock.privioushash && lastblock.index+1==newblock.index){
        console.log('enterd');
        coin.chain.push(newblock);
        coin.pandingtransaction=[];
        res.json({
            status:1,
            massage:'sucessfully add block.'
        })
    }else{
        res.json({
            status:0,
            massage:'block rejected.'
        })
    }
   
}


//create transaction and brodcat in all nodes
exports.createtransaction=(req,res)=>{
let transaction=coin.createnewtransaction(req.body.amount,req.body.sender,req.body.resiption);
// ragister in current node becoase of current url is note prasent in networknode url array.
coin.addtransactiontopandingtransaction(transaction);
let  promisestransaction=[];
// brodcast in all network
coin.newNetworkNode.map((element,index)=>{
    let option={
        url:element + 'newtransaction/broadcast',
        method: 'post',
        data:transaction,
    }
    promisestransaction.push(axios(option));
})

Promise.all(promisestransaction).then((value)=>{
res.json({
    status:1,
    message:`create new transaction and broadcast sucess fully`,
})
})
}


// ragister transaction in all node
exports.broadcasttransaction=(req,res)=>{
    const index=coin.addtransactiontopandingtransaction(req.body);
    res.json({
        status:1,
        message:`create new transaction sucess fully in block no ${index}`,
    })
    }

exports.ragister_and_bordcast_node=(req,res)=>{
    let newNetworkNodeurl=req.body.newNetworkNode;
    //ragister current url in network 
    if(coin.newNetworkNode.indexOf(newNetworkNodeurl)==-1) coin.newNetworkNode.push(newNetworkNodeurl);
    let nodearray=[]
    // ragister current node url in all node
    coin.newNetworkNode.map((element,index)=>{
        console.log('enterelement',element);
        let option={
            url:element + 'register_node',
            method: 'post',
            data:{newurl:newNetworkNodeurl},
        }
        nodearray.push(axios(option));
    })
    // ragister all node url in current node 
    Promise.all(nodearray).then((value)=>{
        const ragisterbulknodeinnewnode={
            url:newNetworkNodeurl + 'ragister_node_bulk',
            method:'post',
            data:{allnodeurl:[...coin.newNetworkNode,coin.currentNodeUrl]},
            // json:true
        }
       return axios(ragisterbulknodeinnewnode);
       
    }).then((value)=>{
        res.json({
            status:1,
            message:'natwork ragister sucessfully'
        })
    })
}
// ragister current node url in all node
exports.ragister_node=(req,res)=>{
    // console.log('enter',req.body.newurl);
   let newNetworkNodeurl=req.body.newurl;
    if(coin.newNetworkNode.indexOf(newNetworkNodeurl)==-1 && coin.currentNodeUrl!==newNetworkNodeurl) coin.newNetworkNode.push(newNetworkNodeurl);
        // console.log('enter,done') 
    res.json({
        status:1,
        message:'natworkurl ragister sucessfully'
     });
    
        
}
// ragister all node url in current node 
exports.ragister_node_bulk=(req,res)=>{
    const allnatworknodesurl=req.body.allnodeurl;
    allnatworknodesurl.map((element,index)=>{
      if(coin.newNetworkNode.indexOf(element)==-1 && coin.currentNodeUrl!==element)  coin.newNetworkNode.push(element);
    });
    res.json({
        status:1,
        message:'bulk node ragister in current node'
    })
}

exports.consenses=(req,res)=>{
    let blockchainarray=[];
    //get all node block chain
    coin.newNetworkNode.map((newNetworkNodeurl)=>{
        const getblockchain={
            url:newNetworkNodeurl + 'getblockchain',
            method:'get',
        }
        blockchainarray.push(axios(getblockchain))

    })
    
    Promise.all(blockchainarray).then((blockchain)=>{
        let maxchainlenth=coin.chain.length;
        let newmaxchain=null;
        let newpandingtransection=null;
        
//find max lenth chain in all nodes.
        blockchain.map((element)=>{
            
            if(maxchainlenth<element.data.chain.chain.length){
                maxchainlenth=element.data.chain.chain.length;
                newmaxchain=element.data.chain.chain;
                newpandingtransection=element.data.chain.pandingtransaction;
            }
        })

//check new max lenth chain is valid or note
console.log(newmaxchain,(newmaxchain && !coin.chainIsValid(newmaxchain)),"pppp");
        if(!newmaxchain ||(newmaxchain && !coin.chainIsValid(newmaxchain))) {
            res.json({
                message:'current chain is not replace',
                chain:coin.chain
            })
// if newmaxchain is valid then it's replace to current chain
        }else if(newmaxchain &&coin.chainIsValid(newmaxchain)){
            coin.chain=newmaxchain;
            coin.pandingtransaction=newpandingtransection;
            res.json({
                message:'current chain is replace',
                chain:coin.chain
            })
        }
    })
}

exports.block=(req,res)=>{
  let hash=req.params.hash;
  let blockdata=coin.block(hash);
  res.json({
      status:1,
      massage:'sucess',
      block:blockdata,
  })
}


exports.treansaction=(req,res)=>{
    let transactionid=req.params.transactionid;
    let transaction=coin.transaction(transactionid);
    res.json({
        status:1,
        massage:'sucess',
        block:transaction.block,
        transactions:transaction.transaction
    })

}
exports.address=(req,res)=>{
    let address=req.params.address;
    let adressdata=coin.addressdata(address);
    res.json({
        status:1,
        message:'sucess',
        amount:adressdata.amount,
        transaction:adressdata.transaction
    })
}