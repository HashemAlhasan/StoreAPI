const { query } = require('express')
const Product=require('../models/product')


const getAllProductsStatic=async(req,res,next)=>{
    const products=await Product.find({}).select('name price')
    res.status(200).json({products,nbHits:products.length})
}
const getAllProducts=async(req,res,next)=>{
    const{featured,company,name,sort,fields,numericFilters}=req.query;
  const  queryObject= {}
  if (featured) {queryObject.featured=featured==='true'?true:false}
  if(company){queryObject.company=company}
  if(name){
    queryObject.name={$regex:name,$options:'i'}}
  //console.log(queryObject) 
    let result= Product.find(queryObject)
    if(sort){
      let sortList=sort.split(',').join(' ') ; 
      console.log(sort)
      //console.log(sortList) 
        
        result=result.sort(sortList)}
        else{
            result=result.sort('createdAt')
        }
        if(fields){
            let fieldsList=fields.split(',').join(' ') ; 
            result=result.select(fieldsList);
        }
            const limit=Number(req.query.limit) || 10
            const page=Number(req.query.page) || 1
            const skip=(page-1)*limit
            result=result.skip(skip).limit(limit)
            if(numericFilters){
                const operatorMap ={
                    '>':'$gt',
                    '>=':'$gte',
                    '<':'$lt',
                    '<=':'$lte',
                    '=':'$eq',

                }
                const regExp= /\b(<|>|<=|>=|=)\b/g
                let filters=numericFilters.replace(regExp,(match)=>
                    `-${operatorMap[match]}-`
                
                )
                const options=['price','rating']
                filters=filters.split(',').forEach(item => {
                    const [field,operator,value]=item.split('-');
                    if(options.includes(field)){queryObject[field]={[operator]:Number(value)}}
                    
                });
            }

        const products=await result
    res.status(201).json({products,nbHits:products.length})
}

module.exports={
    getAllProducts,
    getAllProductsStatic
}