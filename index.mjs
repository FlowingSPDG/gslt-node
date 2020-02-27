import request from "superagent"

export class GSLT {
    constructor(api_key,steamid,appid,login_token,memo){
        this._api_key = api_key
        this._steamid = steamid
        this._appid = appid
        this._login_token = login_token
        this._memo = memo
        this._is_deleted = false
        this._is_expired = false
        this._rt_last_logon = 0 // time stamp??
    }
    get api_key(){
        return this._api_key
    }
    get steamid(){
        return this._steamid
    }
    get appid(){
        return this._appid
    }
    get login_token(){
        return this._login_token
    }
    get memo(){
        return this._memo
    }
    get is_deleted(){
        return this._is_deleted
    }
    get is_expired(){
        return this._is_expired
    }
    get rt_last_logon(){
        return this._rt_last_logon
    }
    
    async Delete(){
        return new Promise((resolve, reject)=> {
            request
                .post(`https://api.steampowered.com/IGameServersService/DeleteAccount/v1/?key=${this._api_key}&steamid=${this._steamid}`)
		        .set('accept', 'json')
		        .end((err,res) => {
		        	console.log(`Deleted ${this._steamid}`);
                })
            this._is_deleted = true
            resolve()
        })
    }
    async ResetLoginToken(){
        return new Promise((resolve, reject)=> {
            request
                .post(`https://api.steampowered.com/IGameServersService/ResetLoginToken/v1/?key=${this._api_key}&steamid=${this._steamid}`)
		        .set('accept', 'json')
		        .end((err,res) => {
                    this._login_token = res.body.response.login_token
                })
            resolve()
        })
    }
    async SetMemo(memo){
        return new Promise((resolve, reject)=> {
            request
                .post(`https://api.steampowered.com/IGameServersService/SetMemo/v1/?key=${this._api_key}&steamid=${this._steamid}&memo=${memo}`)
                .set('accept', 'json')
                .end((err,res) => {
                    console.log(`Set Memo ${this._steamid}`);
                })
            this._memo = memo
            resolve()
        })
    }
    // ResetLoginToken(){}
    // GetAccountPublicInfo(){}
    // QueryLoginToken(){}
}

export class Manager {
    constructor(api_key) {
        this._api_key = api_key
        this._gslts = []
    }
    get api_key(){
        return this._api_key
    }
    set api_key(key){
        this._api_key = key
    }
    get gslts(){
        return this._gslts
    }
    // Generates GSLT and put it in this.gslts
    async Generate(app_id,memo) {
        return new Promise((resolve, reject)=> {
            request
    		    .post(`https://api.steampowered.com/IGameServersService/CreateAccount/v1/?key=${this._api_key}&appid=${app_id}&memo=${memo}`)
    		    .set('accept', 'json')
    		    .end((err, res) => {
                    const gslt = new GSLT(this._api_key,res.body.response.steamid,app_id,res.body.response.login_token,memo)
                    this._gslts.push(gslt)
                    resolve(gslt)
                })
        })
    }
    async RefreshList(){
        return new Promise((resolve, reject)=> {
            request
    		    .get(`https://api.steampowered.com/IGameServersService/GetAccountList/v1/?key=${this._api_key}`)
    		    .set('accept', 'json')
    		    .end((err, res) => {
                    this._gslts = []
                    for(let i=0;i<res.body.response.servers.length;i++){
                        const gslt = new GSLT(
                            this._api_key,res.body.response.servers[i].steamid,
                            res.body.response.servers[i].appid,
                            res.body.response.servers[i].login_token,
                            res.body.response.servers[i].memo
                        )
                        this._gslts.push(gslt)
                    }
                    resolve(this._gslts)
                })
        })
    }
}