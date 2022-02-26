const chaincontroller=require('../controller/chaincontroller');
module.exports=app=>{
    app.get('/consensus',chaincontroller.consenses);
    app.post('/newtransaction',chaincontroller.createtransaction);
    app.post('/recive-new-block',chaincontroller.recivenewblock);
    app.post('/newtransaction/broadcast',chaincontroller.broadcasttransaction);
    app.get('/createblock',chaincontroller.createblock);
    app.get('/getblockchain',chaincontroller.blockchain);
    app.post('/register_and_bordcast_node',chaincontroller.ragister_and_bordcast_node);
    app.post('/register_node',chaincontroller.ragister_node);
    app.post('/ragister_node_bulk',chaincontroller.ragister_node_bulk);
   //get block using hash
    app.get('/block/:hash',chaincontroller.block)
//get block and transaction using transaction id
    app.get('/transaction/:transactionid',chaincontroller.treansaction)
//get total amount and all transaction of any sender or recipient address
    app.get('/addressdata/:address',chaincontroller.address)
}



