const express = require('express');
const rootRouter = require('./routes/index');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1',rootRouter);

// request will look like this
// api/v1/user/signup 
// api/v1/user/signin
// api/v1/user/changepassword ...

// api/v1/account/transferMoney 
// api/v1/account/balance

app.listen(port,()=>{
    console.log('App listening PORT:'+port);
})

