const client = require('../DBconnect')

class Query{
   
    constructor(data){

        this.cellFilter=data.cellFilter
        this.valueFilter=data.valueFilter
        switch (data.typeFilter) {
            case 'equals': this.queryBody=this.cellFilter+'='+this.valueFilter
            break;
            case 'contains': this.queryBody=this.cellFilter+'::text LIKE %'+this.valueFilter+'%'
            break;
            case 'more': this.queryBody=this.cellFilter+'>'+this.valueFilter
            break;
            case 'less':this.queryBody=this.cellFilter+'<'+this.valueFilter
            break;
          }
      
        
    }

    
    queryStr(){
        
        const str='SELECT * FROM datacell WHERE'+this.queryBody
      return  client.connect(
            ()=>{
                client.query(str)
            }
            )
    }
    

}

module.exports=Query